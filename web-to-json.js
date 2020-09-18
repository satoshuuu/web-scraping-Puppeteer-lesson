const puppeteer = require('puppeteer');

const runPuppeteer = async (pageUrl, querySelector) => {
  //puppeteerの起動
  const browser = await puppeteer.launch({ args: ['--no-sandbox']});

  //新しいページの作成
  const page = await browser.newPage();

  //作成したページを指定したurlへ
  await page.goto(pageUrl);

  const list = await page.$$(querySelector);

  const listTexts = [];
  for (let i = 0; i < list.length; i++) {
    const textContentProp = await list[i].getProperty('textContent');
    const textContent = await textContentProp.jsonValue();
    
    listTexts.push(textContent);
  }

  //puppeteerの終了
  await browser.close();

  //取得したテキストを返却
  return listTexts;
};

url = 'URL';
selector = 'セレクター'; 

runPuppeteer(url, selector).then(console.log).catch(console.error);