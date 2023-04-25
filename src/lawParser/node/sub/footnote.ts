const removeTags = (text:string) => {
  return text.replaceAll(/\s*<([^>]+?)([^>]*?)>/ig, "").replaceAll(/<\/\1>/ig, "")
}
const getParagraphFootnote = (textdata:any) => {
  if(textdata.fussnoten?.Content) {
    const initialMemo:any = [];
    const footnote = textdata.fussnoten.Content
    .split('<BR/>').reduce((memo:any, item:any) => {
      if(item) memo.push(removeTags(item));
      return memo;
    }, initialMemo);
    return footnote;
  }
  return null;
}
const getContentFootnote = (textdata:any) => {
  if(textdata.text?.Footnotes) {
    const initialMemo:any = [];
    if(Array.isArray(textdata.text.Footnotes.Footnote)) {
      return textdata.text.Footnotes.Footnote.map((footItem:any) => {
        const footnote = footItem['#text'].split('<BR/>').reduce((memo:any, item:any) => {
          if(item) memo.push(removeTags(item));
          return memo;
        }, initialMemo);
        return footnote;
      })
    } else {
      const footnote = textdata.text.Footnotes.Footnote['#text'].split('<BR/>').reduce((memo:any, item:any) => {
        if(item) memo.push(removeTags(item));
        return memo;
      }, initialMemo);
      return footnote;
    }
  }
  return null;
}
export const getFootnotes = (textdata:any) => {
  const paragraphFootnote = getParagraphFootnote(textdata);
  const contentFootnote = getContentFootnote(textdata);
  return {
    contentFootnote: contentFootnote,
    paragraphFootnote: paragraphFootnote
  }
}
