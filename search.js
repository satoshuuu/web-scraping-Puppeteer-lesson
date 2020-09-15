const puppeteer = require('puppeteer');

(async () => {
  //puppeteerの起動
  const browser = await puppeteer.launch();
  //新しいページの作成
  const page = await browser.newPage();
  //作成したページを指定したurlへ
  await page.goto('https://example.com');
  //スクリーンショットを撮る
  await page.screenshot({path: 'example.png'});
  //puppeteerの終了
  await browser.close();
})();