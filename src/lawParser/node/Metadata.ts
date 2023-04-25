import { NormType } from '../util/NormType';

const checkStructureObject = (metadata: any) => {
  if (metadata) {
    if (metadata.gliederungseinheit) {
      const structureObject = {
        id: metadata.gliederungseinheit.gliederungskennzahl,
        name: metadata.gliederungseinheit.gliederungsbez,
        title: metadata.gliederungseinheit.gliederungstitel,
        metaType: NormType.Structure
      }
      return structureObject;
    }
  }
};
export const analyseMetadata = (metadata: any) => {
  const structureObject = checkStructureObject(metadata);
  if (structureObject) return structureObject;
  if (!metadata.enbez) {
    const jurabk = metadata.jurabk;
    const amtabk = metadata.amtabk;
    const langue = metadata.langue;
    const copy = metadata['ausfertigung-datum']['#text'];
    const source = metadata.fundstelle ?.periodikum + ' ' + metadata.fundstelle ?.zitstelle;
    const standangabe =
      metadata.standangabe ?.length ? metadata.standangabe ?.map((item: any) => {
        return {
          type: item.standtyp,
          content: item.standkommentar
        };
      }) : {
          type: metadata.standangabe ?.standtyp,
          content: metadata.standangabe ?.standkommentar
    };
    console.log(metadata);
    const metaObject = {
      jurabk,
      amtabk,
      langue,
      copy,
      source,
      standangabe,
      metaType: NormType.Meta
    };
    return metaObject;
  }
  if (!metadata.titel) {
    return {
      enbez: metadata.enbez,
      metaType: NormType.Additive
    }
  }
  if (metadata.enbez.startsWith('§') || metadata.enbez.startsWith('Art') || metadata.enbez.startsWith('(XXXX)')) {
    const enbez = metadata.enbez;
    const title = metadata.titel ? metadata.titel['#text'] : '';
    return {
      title,
      enbez,
      metaType: (metadata.enbez.startsWith('(XXXX)') || title === '(weggefallen)') ? NormType.DroppedNorm : NormType.Norm
    }
  } else {
    return {
      title: metadata.titel ? metadata.titel['#text'] : '',
      enbez: metadata.enbez,
      metaType: NormType.Other
    }
  }
};
