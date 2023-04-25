import { getStructuredText } from '../node/StructuredNode';

//generate client side
export const getTOC = (textdata:any) => {
  if(textdata.text?.Content?.startsWith('<TOC>')) {
    const toc = textdata.text.Content;
    const struct = getStructuredText(`<TOC>${textdata.text.Content}</TOC>`);
    return struct;
  }
  if(textdata.text?.TOC) {
    const struct = getStructuredText(`<TOC>${textdata.text.TOC}</TOC>`);
    const toc = textdata.text.TOC;
    return struct;
  }
  return null;
}
