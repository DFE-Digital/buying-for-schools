/* global describe it expect afterAll */

const puppeteer = require('puppeteer')
const { server } = require('./app/index')
const SERVICE_URL = 'http://localhost:5000'

describe('e2e', () => {
  it('should show page with h1', async (done) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.bbc.co.uk');
    const title = await page.evaluate((s) => document.querySelector(s).innerText, 'h1')
    expect(title).toBe('BBC Homepage')

    await server.close()
    await browser.close()
    done()
  })
})
