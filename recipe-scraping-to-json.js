const puppeteer = require('puppeteer');
const fs = require('fs');

//jsonファイルに書き込む関数
function writeFile(path, data) {
  const jsonStr = JSON.stringify(data);
  fs.writeFile(path, jsonStr, (err) => {
    if (err) rej(err);
    if (!err) {
      console.log('Jsonの更新が成功');
      console.log(data);
    }
  });
}

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

  const originalData = {
    Title: title,
    materials: materialDatas
  };

  const fileName = "result.json";

  let obj = {
    recipe: []
  };

  fs.exists(fileName, function (exists) {

    if (exists) {

      console.log("yes file exists");

      fs.readFile(fileName, function readFileCallback(err, data) {

        if (err) {
          console.log(err);
        } else {
          obj = JSON.parse(data);

          obj.recipe.push(originalData);

          let json = JSON.stringify(obj);
          fs.writeFile(fileName, json,(err)=>{
            if (err) console.log(`error!::${err}`);
          });
        }
      });
    } else {

      console.log("file not exists");

      obj.recipe.push(originalData);

      let json = JSON.stringify(obj);
      fs.writeFile(fileName, json,(err)=>{
        if(err) console.log(`error!::${err}`);
      });
    }
  })
};

url = "スクレイピング先のURL";
title = '.recipe-title';
material = '.ingredient_row > .ingredient_name';

runPuppeteer(url, title, material).catch(console.error);