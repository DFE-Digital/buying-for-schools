const { server } = require('../../app/index')

const { setWorldConstructor } = require("cucumber")
const { expect } = require("chai")
const puppeteer = require("puppeteer")

const HOMEPAGE = "http://localhost:5000"

class B4SWorld {
  constructor() {
    this.todo = ""
  }

  async gotoPage(page) {
    let result = null
    try {
      this.browser = await puppeteer.launch()
      this.page = await this.browser.newPage()
      const result = await this.page.goto(HOMEPAGE + page)
      console.log('page', HOMEPAGE + page)
    } catch (e) {
      console.log(e)
    }
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
