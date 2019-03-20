/* global describe it expect afterAll */

const puppeteer = require('puppeteer')
const { server } = require('./app/index')
const SERVICE_URL = 'http://localhost:5000'
let browser = null
let page = null

beforeAll(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()
})

describe('e2e', () => {
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

  urls.forEach(u => {
    it(`should show page with h1: ${u}`, async () => {
      const onpage = await page.goto(SERVICE_URL + u)
      const title = await page.evaluate((s) => document.querySelector(s).innerText, 'h1')
      console.log(title)
      expect(typeof title).toBe('string')
    })
  })
})

afterAll(async () => {
  console.log('afterAll')
  await browser.close()
  await server.close()
})