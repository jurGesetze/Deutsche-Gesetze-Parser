const { DOMParser, XMLSerializer } = require('@xmldom/xmldom')

const simplifiedBranch = (node: any) => {
  const simplifiedNode = {
    tagName: node.tagName ?? '#text',
    children: node.hasChildNodes() ? Array.from(node.childNodes).map(simplifiedBranch) : null,
  } as any;
  if (simplifiedNode.tagName === '#text') {
    if (node.parentNode.tagName === 'LA') {
      simplifiedNode.tagName = 'LA';
    } else if (node.parentNode.tagName === 'DT') {
      simplifiedNode.tagName = 'DT';
    } else if (node.parentNode.tagName === 'DD') {
      simplifiedNode.tagName = 'DD';
    }
  }

  if (!node.hasChildNodes()) delete simplifiedNode.children;

  if (node.tagName === 'tgroup') {
    simplifiedNode.cols = node.getAttribute('cols');
  }

  const keepHtml = ['table', 'pre', 'NB', 'tgroup']

  if ([undefined, 'DT', 'TOC', 'NOTINDEXED', 'entry', 'LA', 'DD', 'Ident', ...keepHtml].includes(node.tagName)) {
    simplifiedNode.text = node.textContent
  }

  return simplifiedNode;
}


export const getStructuredText = (rawText: string) => {
  const doc = new DOMParser().parseFromString(`<Content>${rawText}</Content>`, 'text/xml')

  const structuredNodes = [] as any;

  Array.from(doc.getElementsByTagName('*')).map((node: any) => {
    const branch = simplifiedBranch(node);
    const markup = branchToMarkup(branch);
    if (markup.length) {

      structuredNodes.push(markup);
    }
  });
  return structuredNodes;
}

const makeStyledJsonMarkupText = (ast: any, text: any) => {
  if (!text) return { type: 'break' };
  if (!text.trim().length && ast.tagName !== 'B' && ast.tagName !== 'I' && ast.tagName !== 'U') return { type: 'break' };
  return {
    type: 'text',
    content: text,
    bold: ast.tagName === 'B' ?? false,
    italic: ast.tagName === 'I' ?? false,
    underline: ast.tagName === 'U' ?? false,
  }
}

const makeStyledJsonMarkupList = (ast: any) => {
  const keys = ast.children
    .filter((child: any) => child.tagName === 'DT')
    .map((child: any) => child ?.text)

  const values = ast.children
    .filter((child: any) => child.tagName === 'DD')
    .map((child: any) => child.children.map((nestedChild: any) => {
      if (nestedChild.children) {
        return nestedChild.children.map((nestedNestedChild: any) => {
          if (nestedNestedChild.tagName === 'DL') {
            return makeStyledJsonMarkupList(nestedNestedChild);
          }
          if (nestedNestedChild.children && nestedNestedChild.children.length > 0) {
            return makeStyledJsonMarkupText(nestedNestedChild, nestedNestedChild.children ?.map((childN: any) => childN.text)[0]);
          }
          return makeStyledJsonMarkupText(ast, nestedNestedChild.text)
        })
      } else {
        return [{
          "type": "break"
        }]
      }
    })
    )
  return {
    type: 'list',
    content: keys.map((key: any, i: any) => {
      return {
        enum: key,
        value: values[i]
      }
    }),
  }
}

const buildChildren = (ast: any) => {
  const children = ast.children;
  return children.map((child: any) => {
    if (child.tagName === '#text') {
      return makeStyledJsonMarkupText(ast, child.text)
    } else {
      return branchToMarkup(child);
    }
  })
}


const buildTable = (ast: any) => {
  const children = ast.children;

  const values = ast.children
    .filter((child: any) => child.tagName === 'tbody')
    .map((child: any) => child.children.filter((nestedChild: any) => nestedChild.tagName === 'row').map((nestedChild: any) => {
      if (nestedChild.tagName === 'row') {

        return (nestedChild.children.map((entry: any) => {
          if (entry.children ?.length) {
            return (entry.children.map((entryChild: any) => {
              if (entryChild.tagName === '#text') {

                return makeStyledJsonMarkupText(entry, entryChild.text)
              } else if (entryChild.tagName === 'DL') {


                if (ast.tagName !== 'LA') return makeStyledJsonMarkupList(entryChild);

              } else if (entryChild.tagName === 'BR') {

                return { type: 'break' };

              } else if (entryChild.tagName === 'B' || entryChild.tagName === 'I' || entryChild.tagName === 'U') {

                if (entryChild.children && entryChild.children.length > 0) {
                  return makeStyledJsonMarkupText(entryChild, entryChild.children ?.map((child: any) => child.text)[0]);
                }
                return makeStyledJsonMarkupText(entryChild, entryChild.text)

              } else if (entryChild.tagName === 'SP') {
                if (entryChild.children && entryChild.children.length > 0) {

                  return (entryChild.children.map((spChild: any) => {
                    if (spChild.tagName === 'B' || spChild.tagName === 'I' || spChild.tagName === 'U') {
                      if (spChild.children && spChild.children.length > 0) {
                        return makeStyledJsonMarkupText(spChild, spChild.children ?.map((child: any) => child.text)[0]);
                      }
                      return makeStyledJsonMarkupText(spChild, spChild.text)
                    } else if (spChild.tagName === '#text') {
                      return makeStyledJsonMarkupText(spChild, spChild.text)
                    } else {
                      console.warn(spChild);
                    }
                  })[0])

                }
              } else if (entryChild.tagName === 'IMG') {
                return { type: 'break' };
              }
            }));

          }
          if (entry.text) return makeStyledJsonMarkupText(nestedChild, entry.text);
          return [{ type: 'break' }];
        }));
      }

      return [{
        "type": "break"
      }]
    }));

  const thead = ast.children
    .filter((child: any) => child.tagName === 'thead')
    .map((child: any) => child.children.map((nestedChild: any) => {
      if (nestedChild.tagName === 'row') {
        return nestedChild.children.map((entry: any) => {
          return makeStyledJsonMarkupText(nestedChild, entry.text);
        });
      }
      return {
        "type": "break"
      }
    }));

  return {
    type: 'table',
    content: values.map((key: any, i: any) => {
      return {
        value: values[i]
      }
    }),
    head: thead.map((key: any, i: any) => {
      return {
        value: thead[i]
      }
    }),
    text: ast.text
  }
}

const branchToMarkup = (ast: any) => {
  const { children } = ast as any;

  if (ast.tagName === 'tgroup')
    return buildTable(ast);

  if (ast.tagName === 'pre')
    return buildChildren(ast);

  if (ast.tagName === 'NB') {
    return makeStyledJsonMarkupText(ast, ast.text);
  }

  if (ast.tagName === '#text') {
    return ast.text;
  }

  if (ast.tagName === 'P' || ast.tagName === 'Content') {
    if (!ast.children) {
      return ([{
        type: 'text',
        content: '',
        bold: ast.tagName === 'B' ?? false,
        italic: ast.tagName === 'I' ?? false,
        underline: ast.tagName === 'U' ?? false,
      }])
    }
  }

  if (ast.tagName === 'BR')
    return { type: 'break' };

  return children ?.map((child: any) => {
    switch (child.tagName) {
      case 'row':
        return;
      case 'U':
      case 'B':
      case 'I':
        if (ast.tagName === 'LA' || ast.tagName === 'DT' || ast.tagName === 'entry' || ast.tagName == 'SP') return;
        if (child.children && child.children.length > 0) {
          return makeStyledJsonMarkupText(child, child.children ?.map((child: any) => child.text)[0]);
        }
        return makeStyledJsonMarkupText(ast, child.text)
        break;
      case 'DL':
        if (ast.tagName !== 'LA' && ast.tagName !== 'entry') return makeStyledJsonMarkupList(child)
        break;
      case 'Title':
      case 'Ident':
      case '#text':
        if (child ?.text ?.trim().length !== 0 && ast.tagName !== 'U'
          && ast.tagName !== 'I' && ast.tagName !== 'B' &&
          ast.tagName !== 'entry'
          && ast.tagName !== 'NB'
                 ) {
          return makeStyledJsonMarkupText(ast, child.text)
        }
        break;
      case 'span':
      case 'SPAN':
      case 'SP':
        if (ast.tagName !== 'entry') {
          return branchToMarkup(child)
        }
        break;
      case 'tgroup':
        return buildTable(child);
    }
  }).filter((v: any) => !!v) ?? []
}
