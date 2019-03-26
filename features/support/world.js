const { server } = require('../../app/index')

const { setWorldConstructor, AfterAll } = require("cucumber")
const { expect } = require("chai")
const puppeteer = require("puppeteer")

const HOMEPAGE = "http://localhost:5000"

let browser = null
let page = null

class B4SWorld {
  constructor() {
    console.log('B4SWorld Constructor')
  }
  
  async gotoPage(u) {
    
      // console.log('gotoPage', 'https://www.bbc.co.uk')//HOMEPAGE + u)
      browser = await puppeteer.launch()
      // console.log('Browser launched', Object.keys(browser))
      page = await browser.newPage()
      // console.log('New page', Object.keys(page))
      const onPage = await page.goto(HOMEPAGE + u)
      // console.log('At page', Object.keys(onPage))
    
  }

  async checkText(selector, string) {
    // console.log('CheckText', selector, string)
    const txt = await page.evaluate((s) => document.querySelector(s).innerText, selector)
    return expect(txt).to.eql(string)
  }

  async haveRadioButtons(data) {
    const radioGroups = await page.evaluate(() => document.getElementsByClassName('govuk-radios__item').length)
    const results = []
    for (var i =1; i <= radioGroups; i++) {
      const txt = await page.evaluate((i) => document.querySelector(`.govuk-radios__item:nth-child(${i}) label`).innerText, i)
      const val = await page.evaluate((i) => document.querySelector(`.govuk-radios__item:nth-child(${i}) input`).value, i)
      results.push({ label: txt, value: val })
    }
   
    data.forEach((row, i) => {
      expect(results[i].label).to.eql(row[0])
      expect(results[i].value).to.eql(row[1])
    })

    // console.log('radioGroups', radioGroups, results)
    return results
  }
}


AfterAll(async function() {
  console.log('START: AfterAll')
  await browser.close();
  await server.close()
  console.log('END: AfterAll')
});


setWorldConstructor(B4SWorld)
