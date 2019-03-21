/* global describe it expect afterAll */
const starttime = new Date().getTime()
const et = (msg) => {
  const elapsed = new Date().getTime() - starttime
  console.log(msg, elapsed)
}


et('START')
const puppeteer = require('puppeteer')

const { server } = require('./app/index')
et('Service started')

const SERVICE_URL = 'http://localhost:5000'

jest.setTimeout(30000);

describe('e2e', () => {
  it('should show page with h1', (done) => {
    ( async () => {
      
      const browser = await puppeteer.launch()
      et('Browser launched')
      const page = await browser.newPage()
      et('New page ready')
      await page.goto('https://www.bbc.co.uk');
      et('At target page')
      const title = await page.evaluate((s) => document.querySelector(s).innerText, 'h1')
      et('got title')
      expect(title).toBe('BBC Homepage')
      et('completed test')
      await server.close()
      et('server closed')
      await browser.close()
      et('browser closed')
      done()
    })()
  })
})
