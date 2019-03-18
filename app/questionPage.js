const url = require('url')
const path = require('path')
const nunjucks = require('nunjucks')
const dt = require('./decisionTree/decisionTree')

const questionPage = app => (req, res) => {

  const { tree, serviceName, frameworks, frameworkPath } = app.locals
  const { urlBits, urlInfo, summary } = res.locals

  const questionRef = urlBits[urlBits.length -1]
  const branch = dt.getBranch(tree, questionRef)
  const id = 'decision-tree-' + questionRef
  const radioOptions = {
    idPrefix: id,
    name: 'decision-tree',
    fieldset: {
      legend: {
        text: branch.get('title'),
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    }
  }

  const hint = branch.get('hint')
  if (hint) {
    radioOptions.hint = { text: hint }
  }

  radioOptions.items = branch.get('options').map(option => {
    const optionUrl = path.join(urlInfo.pathname, option.get('ref'))
    const optionHint = option.get('hint')
    return {
      value: optionUrl,
      text: option.get('title'),
      hint: optionHint ? { text: optionHint } : null
    }
  })

  
  if (radioOptions.items.getIn([0, 'text']) !== 'Yes'){
    radioOptions.items = radioOptions.items.sortBy(item => item.text)
  }  

  let err = null
  if (urlInfo.search) {
    const errMsg = branch.get('err') || 'Please choose an option'
    radioOptions.errorMessage = { text: errMsg }
    err = {
      titleText: "There is a problem",
      errorList: [
        {
          text: errMsg,
          href: `#${id}-1`
        }
      ]
    }
  }

  const prefix = branch.get('prefix')
  const suffix = branch.get('suffix') ? nunjucks.render(branch.get('suffix')) : ''

  const pageTitle = err ? 'Error: ' + branch.get('title') : branch.get('title')

  const render = nunjucks.render('question.njk', {
    frameworkPath,
    branch, 
    radioOptions, 
    err,
    summary, 
    suffix,
    prefix,
    serviceName,
    pageTitle
  })
  res.send(render)
}

module.exports = questionPage
