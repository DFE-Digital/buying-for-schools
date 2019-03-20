const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.bbc.co.uk');

  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });

  const title = await page.evaluate((s) => document.querySelector(s).innerText, 'h1')

  console.log('Dimensions:', dimensions);
  console.log('Title:', title);

  await browser.close();
})();