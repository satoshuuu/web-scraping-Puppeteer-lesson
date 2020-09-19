const puppeteer = require('puppeteer');
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const runPuppeteer = async (pageUrl, titleSelector, materialSelector) => {
  //puppeteerの起動
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  //新しいページの作成
  const page = await browser.newPage();

  //作成したページを指定したurlへ
  await page.goto(pageUrl);

  const title = await page.$eval(titleSelector, item => {
    return item.textContent;
  });

  const materials = await page.$$(materialSelector);
  const materialDatas = [];
  for (let i = 0; i < materials.length; i++) {
    materialDatas.push(await (await materials[i].getProperty('textContent')).jsonValue())
  }

  //puppeteerの終了
  await browser.close();

  //CSVファイルに追加
  const data = [
    {
      Title: title,
      materials: materialDatas
    }
  ];

  const csvWriter = createCsvWriter({
    path: "result.csv",
    header: ['Title', 'materials'],
    encoding: "utf-8",
    append: true
  });

  csvWriter.writeRecords(data).then(() => {
    console.log('Done');
  });
};

url = "スクレイピング先のURL";
title = '.recipe-title';
material = '.ingredient_row > .ingredient_name';

runPuppeteer(url, title, material).catch(console.error);