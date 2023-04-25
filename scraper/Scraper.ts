const fs = require('fs')
const { JSDOM, ResourceLoader } = require('jsdom');
const request = require('superagent');
const admZip = require('adm-zip');
const http = require('http');
const https = require('https');
const ProgressBar = require('progress');
const packageJSON = require('../package.json');

const GESETZE_IM_INTERNET = 'https://www.gesetze-im-internet.de'

class CustomResourceLoader extends ResourceLoader {
  fetch(url: any, options: any) {
    if (url.endsWith('.css')) return Promise.resolve(Buffer.from(''))
    return super.fetch(url, options);
  }
}

const resourceLoader = new CustomResourceLoader();

const scrapeLaws = async () => {
  console.info(`JurGesetze ${packageJSON.version} scraping laws...`);


  const gesetzeURL = GESETZE_IM_INTERNET + '/aktuell.html';

  const dom = await JSDOM.fromURL(gesetzeURL, {
    resources: resourceLoader,
  });
  const listAlphabetURLS = dom.window.document.querySelectorAll('.alphabet')
  const alphabetLinks = Array.from(listAlphabetURLS).map((element: any) => element.href)

  let gesetzeURLs = [] as any;

  for (const alphabetURL of alphabetLinks) {
    const dom = await JSDOM.fromURL(alphabetURL, {
      resources: resourceLoader,
    })
    const gesetzeElements = Array.from(dom.window.document.querySelectorAll('#paddingLR12 p'))
      .map((element: any) => element.querySelector('a'))
    gesetzeURLs = gesetzeURLs.concat(Array.from(gesetzeElements).map((element: any) => element.href));
  }

  console.log('⌛ Waiting...')

  const bar = new ProgressBar('[:bar] :percent (:current/:total) :etas', {
      incomplete: '\u001b[90m█\u001b[0m',
      complete: '█',
      width: 40,
      total: gesetzeURLs.length
  });

  const delay = (time: any) => new Promise(resolve => setTimeout(resolve, time));

  const downloadXML = async (url: any, filePath: any, key: any) => {
    const protocol = !url.charAt(4).localeCompare('s') ? https : http;

    return new Promise((resolve: any, reject: any) => {
      const file = fs.createWriteStream(filePath);
      let fileInfo = null;

      const errorHandle = (error: any) => {
        console.log(error);
        fs.unlink(filePath, () => resolve({}));
      }
      const request = protocol.get(url, (response: any) => {
        if (response.statusCode !== 200) {
          errorHandle(`Failed to get '${url}' (${response.statusCode})`);
          return;
        }
        fileInfo = {
          mime: response.headers['content-type'],
          size: parseInt(response.headers['content-length'], 10),
        };
        response.pipe(file);
      });

      file.on('finish', async () => {
        const zip = new admZip(`../laws/${key}-master.zip`);
        const outputDir = `../laws/${key}`;
        await zip.extractAllTo(outputDir, true);
        await fs.unlink(`../laws/${key}-master.zip`, () => resolve({}));
        //console.log(`finished ${key}.`);
      });
      request.on('error', (err: any) => {
        errorHandle('Req: ' + err);
      });
      file.on('error', (err: any) => {
        errorHandle('File: ' + err);
      });
      request.end();
    });
  }
  for (const gesetzURL of gesetzeURLs) {
    const key = gesetzURL.replace(/index.html$/, '').replace(GESETZE_IM_INTERNET, '').replace(/\//g, '');
    //console.log('Getting ' + key);
    await downloadXML(gesetzURL.replaceAll('index.html', 'xml.zip'), `../laws/${key}-master.zip`, key);
    bar.tick();
  }
  console.log('🎉 JurGesetze finished scraping ' + gesetzeURLs.length + ' laws.')
}

if (!fs.existsSync('../laws/'))
  fs.mkdirSync('../laws')

scrapeLaws()
