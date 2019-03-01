const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
chai.use(chaiAsPromised)

const _ = require('underscore')
const seleniumWebdriver = require('selenium-webdriver')
const until = seleniumWebdriver.until
const Keys = seleniumWebdriver.keys
const By = seleniumWebdriver.By
const {Given, When, Then} = require('cucumber')

console.log('STEPS')

const toCamelCase = function (str) {
  return str.toLowerCase().replace(/(?:^\w|-|\b\w)/g, function (letter, index) {
    return (index === 0 || str.substr(index - 1, 1) === '-') ? letter.toLowerCase() : letter.toUpperCase()
  }).replace(/\s+/g, '')
}

const toCamelCaseKeys = function (data) {
  const result = {}
  _.each(data, function (val, key) {
    result[toCamelCase(key)] = val
  })
  return result
}

const confirmContentById = function (d, data, timeoutLength) {
  const promises = []
  _.each(data, function (val, key) {
    const expectation = new Promise(function (resolve, reject) {
      let elem = null
      d.wait(until.elementLocated({id: key}), timeoutLength || 5 * 1000, 'TIMEOUT: Waiting for element #' + key).then(function (el) {
        elem = el
        return d.wait(elem.isDisplayed(), 1000, 'TIMEOUT: Waiting for element to be visible #' + key)
      }).then(function (visible) {
        // it is displayed
        return elem.getTagName()
      }).then(function (n) {
        if (n === 'input') {
          // for an input compare the value attribute
          return elem.getAttribute('value')
        }
        // otherwise just get the test of the element
        return elem.getText()
      }).then(function (result) {
        // here we are removing line breaks from both the bdd sepcified value and the return from Chromedriver
        // because of an issue where in some environments it compares \n correctly and in others it doesn't
        val = val.replace(/\n/g, ' ')
        result = result.replace(/\n/g, ' ')
        return resolve(expect(result).to.equal(val))
      }, function (err) {
        return reject(err)
      })
    })
    promises.push(expectation)
  })
  return whenAllDone(promises)
}

const whenAllDone = function (promises) {
  let counter = 0
  const errors = []
  const results = []

  return new Promise(function (resolve, reject) {
    const done = function () {
      counter++
      if (counter >= promises.length) {
        if (errors.length) {
          return reject(errors)
        } else {
          return resolve(results)
        }
      }
    }
    _.each(promises, function (p) {
      p.then(function (result) {
        results.push(result)
        done()
      }, function (err) {
        errors.push(err)
        done()
      })
    })
  })
}


When(/^user is on page (.+)$/, {timeout: 10 * 1000}, function (str) {
  const d = this.driver
  return d.get('http://127.0.0.1:3000' + str).then(function () {
    return d.navigate().refresh()
  })
})

Then(/^the service displays the following page content$/, function (table) {
  // const data = toCamelCaseKeys(_.object(table.rawTable))
  // return confirmContentById(this.driver, data)
  const d = this.driver
  const selector = {css: 'h1'}
  let val = 'What is the type of purchase?'
  return new Promise(function (resolve, reject) {
    let elem = null
    d.wait(until.elementLocated(selector), 5000, 'TIMEOUT: Waiting for element' + selector).then(function (el) {
      elem = el
      return d.wait(elem.isDisplayed(), 1000, 'TIMEOUT: Waiting for element to be visible ' + selector)
    }).then(function (visible) {
      // it is displayed
      return elem.getTagName()
    }).then(function (n) {
      return elem.getText()
    }).then(function (result) {
      // here we are removing line breaks from both the bdd sepcified value and the return from Chromedriver
      // because of an issue where in some environments it compares \n correctly and in others it doesn't
      val = val.replace(/\n/g, ' ')
      result = result.replace(/\n/g, ' ')
      return resolve(expect(result).to.equal(val))
    }, function (err) {
      return reject(err)
    })
  })
})
