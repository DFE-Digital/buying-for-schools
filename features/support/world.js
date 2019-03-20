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
    this.page = null
  }
  
  async gotoPage(u) {
    console.log('gotoPage', 'https://www.bbc.co.uk')//HOMEPAGE + u)
    browser = await puppeteer.launch()
    page = await browser.newPage()
    await page.goto('https://www.bbc.co.uk')
  }

  async checkText(selector, string) {
    console.log('CheckText', selector, string)
    const txt = await page.evaluate((s) => document.querySelector(s).innerText, selector)
    return expect(txt).to.eql(string)
  }
}


AfterAll(async function() {
  console.log('AfterAll')
  await browser.close();
  return await server.close()
});

class B4SWorldX {
  constructor() {
    this.todo = ""
  }

  async gotoPage(page) {
    let result = null

    try {
      this.browser = await puppeteer.launch()
    } catch (e) {
      console.log(e)
    }

    this.page = await this.browser.newPage()
    result = await this.page.goto(HOMEPAGE + page)
    console.log('page', HOMEPAGE + page)
    console.log('this.browser', this.browser)
    console.log('this.page', this.page)
    return result
  }

  setTodo(todo) {
    this.todo = todo
  }

  async writeTodo() {
    const inputSelector = "section input"
    await this.page.waitForSelector(inputSelector)
    this.inputElement = await this.page.$(inputSelector)
    await this.inputElement.type(this.todo)
  }

  async submit() {
    await this.inputElement.press("Enter")
  }

  async checkTodoIsInList() {
    const todoSelector = "h1"
    await this.page.waitForSelector(todoSelector)
    const todo = await this.page.evaluate(
      todoSelector => document.querySelector(todoSelector).innerText,
      todoSelector
    )
    expect(this.todo).to.eql(todo)
  }

  async checkText(selector, string) {
    await this.page.waitForSelector(selector)

    const result = await this.page.evaluate(
      selector => document.querySelector(selector).innerText,
      selector
    )

    expect(string).to.eql(result)
  }

  async closeTodoPage() {
    await this.browser.close()
    server.close()
  }
}

setWorldConstructor(B4SWorld)
