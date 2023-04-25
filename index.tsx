const fs = require("fs");

const { XMLParser } = require('fast-xml-parser');
import { getNormObject } from './src/lawParser';

const resolveDataObject = async (entry:any) => {
  const xmlDataStr = await fs.promises.readFile(entry, 'utf8').catch((err:any) => {
    if(err.code === 'ENOENT') {
      console.log('')
      console.error('⚠️  ' + entry + '. Versuche "npm run scrape".');
      console.log('');
    }
  });

  if(!xmlDataStr) return;

  console.log('Parsing ' + entry)
  const options = {
      ignoreAttributes : false,
      stopNodes: ['*.Content', "*.P", "*.Footnote", "*.TOC"]
  };
  const parser = new XMLParser(options);
  const json = parser.parse(xmlDataStr);
  const object = {} as any;

  if(!Array.isArray(json.dokumente.norm)) {

    const normObject = getNormObject(json.dokumente.norm);
    if(normObject.metaType === 'META') {
      object.meta = normObject;
    } else if(normObject.metaType === 'DIRECTORY') {
      object.directory = normObject
    } else {
      if(!object.content) {
        object.content = [normObject];
      } else {
        object.content.push(normObject);
      }
    }
    return object;
  }
  json.dokumente.norm.map((norm:any) => {
    const normObject = getNormObject(norm);
    if(!normObject) console.log(norm)

    if(normObject.metaType === 'META') {
      object.meta = normObject;
    } else if(normObject.metaType === 'DIRECTORY') {
      object.directory = normObject
    } else {
      if(!object.content) {
        object.content = [normObject];
      } else {
        object.content.push(normObject);
      }
    }
  });
  return object;
}
const runJurGesetze = async () => {
  const dataObject = await resolveDataObject("./laws/bgb/BJNR001950896.xml"); //parse any XML from gesetze-im-internet
  if(!dataObject) return;
  console.log(dataObject);
  console.log(dataObject.meta);
  console.log(dataObject.content);
}
runJurGesetze();
