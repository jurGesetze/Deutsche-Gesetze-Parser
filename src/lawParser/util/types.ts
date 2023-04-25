export interface Footnote {
  content: string[];
};
export interface Meta {
  jurabk: string;
  amtabk: string;
  langue: string;
  copy: string;
  source: string;
  standangabe: Standangabe[],
  lawbookID: string;
  metaType: 'META'
}
