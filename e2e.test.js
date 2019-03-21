/* global describe it expect afterAll */

const puppeteer = require('puppeteer')
const { server } = require('./app/index')
const SERVICE_URL = 'http://localhost:5000'

jest.setTimeout(30000);

const et = (msg, starttime) => {
  const elapsed = new Date().getTime() - starttime
  console.log(msg, elapsed)
}

describe('e2e', () => {
  it('should show page with h1', (done) => {
    ( async () => {
      const t = new Date().getTime()
      const browser = await puppeteer.launch()
      et('Browser launched', t)
      const page = await browser.newPage()
      et('New page ready', t)
      await page.goto('https://www.bbc.co.uk');
      et('At target page', t)
      const title = await page.evaluate((s) => document.querySelector(s).innerText, 'h1')
      et('got title', t)
      expect(title).toBe('BBC Homepage')
      et('completed test', t)
      await server.close()
      et('server closed', t)
      await browser.close()
      et('browser closed', t)
      done()
    })()
  })
})
