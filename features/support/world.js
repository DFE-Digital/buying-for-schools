// require OUR APPLICATION THAT WE'RE TESTING
require('../../app/index.js')
//

require('chromedriver')

const seleniumWebdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const {setWorldConstructor, AfterAll} = require('cucumber')

const os = require('os')

// config
const headless = true// (process.env.HEADLESS !== false && process.env.HEADLESS !== 'false')
const getNewBrowser = function (name) {
  var builder = new seleniumWebdriver.Builder()
  var opts = new chrome.Options()
  if (headless) {
    opts.addArguments(['headless', 'no-sandbox'])
  }
  opts.addArguments('disable-extensions')
  // opts.setChromeBinaryPath('/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary')
  builder.setChromeOptions(opts)

  var forBrowser = builder.forBrowser(name)

  var driver = forBrowser.build()
  // driver.manage().window().setSize(1280, 1024)
  return driver
}
const globalDriver = getNewBrowser('chrome')

function CustomWorld (done) {
  this.driver = globalDriver
  this.driver.get('http://127.0.0.1:3000/frameworks').then(done)
}

setWorldConstructor(CustomWorld)
AfterAll(function (done) {
  process.exit()
})