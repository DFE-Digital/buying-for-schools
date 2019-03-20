const puppeteer = require('puppeteer');

const {server} = require('./app/index');

const testing = async () => {
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
/*
  await page.goto('http://localhost:5000');
  const title2 = await page.evaluate((s) => document.querySelector(s).innerText, 'h1')
  console.log('Title:', title2);

  await page.goto('http://localhost:5000/frameworks');
  const title3 = await page.evaluate((s) => document.querySelector(s).innerText, 'h1')
  console.log('Title:', title3);

  await page.goto('http://localhost:5000/frameworks/type');
  const title4 = await page.evaluate((s) => document.querySelector(s).innerText, 'h1')
  console.log('Title:', title4);
*/
  const urls = [
    '/',
    '/selection',
    '/service-output',
    '/frameworks',
    '/frameworks/type',
    '/frameworks/type',
    '/frameworks/type/buying/what',
    '/frameworks/type/buying/what/books-media/class-library',
    '/frameworks/type/buying/what/books-media/class-library/classroom/books'
  ]

  const getTitle = async(u) => {
    await page.goto('http://localhost:5000' + u)
    const uTitle = await page.evaluate((s) => document.querySelector(s).innerText, 'h1')
    console.log('\n')
    console.log(u)
    console.log('Title', uTitle)
  }

  for (const item of urls) {
      await getTitle(item);  
  }
  console.log('DONE')

  await browser.close();
  await server.close();
}

testing()