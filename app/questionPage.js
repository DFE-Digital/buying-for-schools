const urljoin = require('url-join')
const url = require('url')
const nunjucks = require('nunjucks')

const questionPage = app => (req, res) => {

  const { tree, serviceName, frameworks, frameworkPath } = app.locals
  const { urlBits, urlInfo, summary } = res.locals

  const questionRef = urlBits[urlBits.length -1]
  const branch = tree.getBranch(questionRef)
  const id = 'decision-tree-' + questionRef
  const radioOptions = {
    idPrefix: id,
    name: 'decision-tree',
    fieldset: {
      legend: {
        text: branch.getTitle(),
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    }
  }

  const hint = branch.getHint()
  if (hint) {
    radioOptions.hint = { text: hint }
  }

  radioOptions.items = branch.getOptions().map(option => {
    const optionUrl = urljoin(urlInfo.pathname, option.getRef())
    const optionHint = option.getHint()
    return {
      value: optionUrl,
      text: option.getTitle(),
      hint: optionHint ? { text: optionHint } : null
    }
  })

  
  if (radioOptions.items[0].text !== 'Yes'){
    radioOptions.items.sort((a, b) => {
      const aTitle = a.text.toUpperCase()
      const bTitle = b.text.toUpperCase()
      if (aTitle < bTitle) {
        return -1
      }
      if (aTitle > bTitle) {
        return 1
      }
      return 0
    })
  }

  let err = null
  if (urlInfo.search) {
    const errMsg = branch.getErr() || 'Please choose an option'
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

  // const prefix = branch.getPrefix()
  const suffix = branch.getSuffix() ? nunjucks.render(branch.getSuffix()) : ''

  const pageTitle = err ? 'Error: ' + branch.getTitle() : branch.getTitle()

  const render = nunjucks.render('question.njk', {
    locals: app.locals,
    branch, 
    radioOptions, 
    err,
    summary, 
    suffix,
    pageTitle
  })
  res.send(render)
}

module.exports = questionPage
