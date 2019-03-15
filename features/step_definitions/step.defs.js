const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const seleniumWebdriver = require('selenium-webdriver')
const until = seleniumWebdriver.until
const Keys = seleniumWebdriver.keys
const By = seleniumWebdriver.By
const {Given, When, Then} = require('cucumber')

/*
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
*/

const stripn = str => str.replace(/\n/g, ' ')


const getSelector = ref => {
  switch (ref.toLowerCase()) {
    case 'heading': {
      return { css: 'h1' }
    }
    case 'submit': {
      return { css: '[type=submit]' }
    }

    case 'recommendation': {
      return { css: 'h1 ~ p.govuk-body-l' } 
    }
  }

  return { css: ref }
}

const waitUntilLocatedAndVisible = (d, selector) => {
  let elem = null
  return d.wait(until.elementLocated(selector), 5000, 'TIMEOUT: Waiting for element ' + selector).then(el => {
    elem = el
    return d.wait(elem.isDisplayed(), 1000, 'TIMEOUT: Waiting for element to be visible ' + selector)
  }).then(visible => {
    return elem
  })
}

const waitUntilAllLocatedAndVisible = (d, selector) => {
  return new Promise((resolve, reject) => {
    let elems = null
    d.wait(until.elementsLocated(selector), 5000, 'TIMEOUT: Waiting for element ' + selector).then(elements => {
      elems = elements
      const promises = elements.map(el => {
        return d.wait(el.isDisplayed(), 1000, 'TIMEOUT: Waiting for element to be visible ' + selector)
      })
      whenAllDone(promises).then(result => resolve(elems), reject)
    })
  })
}

const compareResult = (expected, actual) => {
  return new Promise((resolve, reject) => {
    expected = stripn(expected)
    actual = stripn(actual)
    const ok = expect(actual).to.equal(expected)
    if (ok) {
      return resolve(true)
    }
    return reject(ok)
  })
}

const confirmContentBySelector = (d, selector, expectation) => {
  return new Promise((resolve, reject) => {
    waitUntilLocatedAndVisible(d, selector)
      .then(el => el.getText())
      .then(actual => compareResult(expectation, actual))
      .then(ok => resolve(ok), err => reject(err))
      .catch(err => {
        reject(err)
      })
    })
  return whenAllDone(promises)
}

const getRadioDetails = elements => {
  const details = []
  return new Promise((resolve, reject) => {
    const promises = elements.map(el => {
      const detail = {}
      details.push(detail)
      return el.getAttribute('value').then(v => {
        detail.value = v
        return el.getAttribute('name')
      }).then(n => {
        detail.name = n
        return el.getAttribute('id')
      }).then(id => {
        detail.id = id
        return waitUntilLocatedAndVisible(el.getDriver(), {css: `label[for="${id}"]`})
      }).then(el => {
        return el.getText()
      }).then(txt => {
        detail.label = txt
        return true
      })
    })
    whenAllDone(promises).then(result => resolve(details), err => reject(err))
  })
}

const getLinkDetails = elements => {
  const details = []
  return new Promise((resolve, reject) => {
    const promises = elements.map(el => {
      const detail = {}
      details.push(detail)
      return el.getAttribute('href').then(v => {
        detail.href = v.includes('http://127.0.0.1:5000/') ? v.substr(21) : v
        return el.getText()
      }).then(txt => {
        detail.text = stripn(txt)
        return true
      })
    })
    whenAllDone(promises).then(result => resolve(details), err => reject(err))
  })
}

const confirmContentsBySelectors = (d, data) => {
  const promises = data.map(item => {
    return confirmContentBySelector(d, item.selector, item.expectation)
  })
  return whenAllDone(promises)
}

const confirmRadioButtons = (d, data) => {
  return waitUntilAllLocatedAndVisible(d, {css: "input[type=radio]"})
  .then(elements => getRadioDetails(elements))
  .then(details => {
    data.forEach(row => {
      const radioDetails = details.find(radio => radio.label === row[0])
      expect(radioDetails, `Cannot find radio by label: ${row[0]}`).to.be.an('object')
      if (row.length >= 2) {
        expect(radioDetails.value).to.equal(row[1])
      }
    })
  })
}

const confirmLinks = (d, data) => {
  return waitUntilAllLocatedAndVisible(d, {css: "a"})
  .then(elements => getLinkDetails(elements))
  .then(details => {
    data.forEach(row => {
      expect(details).to.deep.include({href: row[1], text: stripn(row[0]) })
    })
  })
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
    promises.forEach(p => {
      p.then(result => {
        results.push(result)
        done()
      }, err => {
        errors.push(err)
        done()
      })
    })
  })
}


When(/^user is on page (.+)$/, {timeout: 10 * 1000}, function (str) {
  const d = this.driver
  return d.get('http://127.0.0.1:5000' + str).then(function () {
    return d.navigate().refresh()
  })
})

Then(/^the service displays the following page content$/, function (table) {
  const dataToConfirm = []
  table.raw().forEach(row => {
    const selector = getSelector(row[0])
    dataToConfirm.push({ selector, expectation: row[1] })
  })

  return confirmContentsBySelectors(this.driver, dataToConfirm)
})

Then(/^have radio buttons$/, function (table) {
  return confirmRadioButtons(this.driver, table.raw())
})

Then(/^have links$/, function (table) {
  return confirmLinks(this.driver, table.raw())
})
