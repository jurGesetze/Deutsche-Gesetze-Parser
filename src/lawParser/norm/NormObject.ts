import { NormType } from '../util/NormType';
import { getTOC } from '../node/TOC';
import { getFootnotes } from '../node/sub/footnote';
import { analyseMetadata } from '../node/Metadata';
import { getStructuredText } from '../node/StructuredNode';

export const getNormObject = (norm: any) => {
    const root = norm;
    const metadata = root.metadaten;
    const textdata = root.textdaten;

    const analysedMetadata = analyseMetadata(metadata);
    const normObject = getObject(textdata, analysedMetadata);

    return normObject;
};
const getObject = (textdata:any, metadata:any) => {
    const footnoteObject = getFootnotes(textdata);
    const toc = getTOC(textdata);

    if(metadata.enbez === 'Inhaltsübersicht') {
      metadata['metaType'] = NormType.Directory;
      return {...metadata, toc}
    }
    if(metadata.metaType === NormType.Norm) {
      if(textdata?.text?.Content !== undefined){
          const struct = getStructuredText(textdata.text.Content);
          const normContent = {
            normContent: struct
          };
          return {...metadata, ...normContent, footnotes: {...footnoteObject}};
      }
    }
    if(metadata.metaType === NormType.DroppedNorm) {
      return {...metadata};
    }
    if(metadata.metaType === NormType.Structure) {
      return {...metadata};
    }
    if(metadata.metaType === NormType.Meta) {
        return {...metadata, footnotes: {...footnoteObject}, toc: toc}
    }
    if(metadata.metaType === NormType.Additive) {
      if(metadata.enbez === 'Eingangsformel' || metadata.enbez === 'Präambel') {
        if(textdata?.text?.Content !== undefined){
          const struct = getStructuredText(textdata.text.Content);

          const normContent = {
            normContent: struct
          };
          metadata['metaType'] = NormType.EntryPhrase;
          return {...metadata, ...normContent}
        }
      }
      if(metadata.enbez === 'Schlußformel' || metadata.enbez === 'Schlussformel') {
        if(textdata?.text?.Content !== undefined){
          const struct = getStructuredText(textdata.text.Content);
          const normContent = {
            normContent: struct
          };
          metadata['metaType'] = NormType.Complimentary;
          return {...metadata, ...normContent}
        }
      }
      if(textdata?.text?.Content !== undefined && toc === null){
        const struct = getStructuredText(textdata.text.Content);
        const normContent = {
          normContent: struct
        };
        if(normContent.normContent[0][0].content === '(weggefallen)') {
          metadata['metaType'] = NormType.DroppedNorm;
          return {...metadata, ...normContent}
        } else if(normContent.normContent[0][0].content !== undefined){
          metadata['metaType'] = NormType.Norm;
          return {...metadata,  ...normContent}
        }
      } else {
        if(toc) {
            metadata['metaType'] = NormType.Directory;
            return {...metadata, toc}
        }
        return {...metadata}
      }
    }
    if(metadata.metaType === NormType.Other || metadata.metaType === NormType.Additive) {
      if(metadata.enbez.startsWith('Anlage') || metadata.enbez.startsWith('Anhang')) {
        if(textdata?.text?.Content !== undefined){
          const struct = getStructuredText(textdata.text.Content);
          metadata['metaType'] = NormType.Attachment;
          return {...metadata,  attachment: struct, footnotes: {...footnoteObject}}
        }
      }
      return {...metadata};
    }
}
