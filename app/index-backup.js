const express = require('express')
const serveStatic = require('serve-static')
const nunjucks = require('nunjucks')
const path = require('path')
const dtr = require('./decisionTree/decisionTreeRoute')
const dtres = require('./decisionTree/decisionTreeResults')
const dt = require('./decisionTree/decisionTree')
const url = require('url')

const app = express()
const basicAuth = require('express-basic-auth')

const authUser = process.env.AUTHUSER || null
const authPass = process.env.AUTHPASS || null
if (authUser && authPass) {
  const auth = { users: {}, challenge: true }
  auth.users[authUser] = authPass
  app.use(basicAuth(auth))
}
const port = process.env.PORT || 5000

const tree = dt.makeTree(require('./tree.json'))
const frameworks = dtres.makeFrameworks(require('./frameworks.json'))

const serviceName = 'Find a framework'

nunjucks.configure(path.resolve(__dirname, './templates'))

nunjucks.configure([
  path.resolve(__dirname, './templates'),
  path.resolve(__dirname, '../node_modules/govuk-frontend/'),
  path.resolve(__dirname, '../node_modules/govuk-frontend/components/')
], {
  autoescape: true
})

app.use(serveStatic('public/', { 'index': ['index.html'] }))

app.get('/', (req, res, next) => {
  const render = nunjucks.render('framework-benefits.njk', {
    serviceName,
    pageTitle: 'Benefits of using a framework'
  })
  res.send(render)
})

app.get('/selection', (req, res, next) => {
  const render = nunjucks.render('framework-selection.njk', {
    serviceName,
    pageTitle: 'How frameworks are selected'
  })
  res.send(render)
})

app.get('/service-output', (req, res, next) => {
  const render = nunjucks.render('service-output.njk', {
    serviceName,
    pageTitle: 'After you’ve used the service'
  })
  res.send(render)
})

app.use('/frameworks', (req, res, next) => {
  const urlInfo = url.parse(req.url)
  const pairs = dtr.getQuestionAnswerPairSlugs(urlInfo.pathname)
  const baseUrl = req.baseUrl

  if (req.query && req.query['decision-tree']) {
    return res.redirect(302, req.query['decision-tree'])
  }

  if (!dtr.validateQuestionAnswerPairs(tree, pairs, frameworks)) {
    const sanitisedPairs = dtr.getSanitisedQuestionAnswerPairs(tree, pairs)
    const newUrl = baseUrl + '/' + dtr.getUrlFromPairs(sanitisedPairs)
    return res.redirect(302, newUrl)
  }

  const branchPath = dtr.getBranchPath(tree, pairs)
  const currentUrl = baseUrl + '/' + dtr.getUrlFromPairs(pairs)
  const currentBranch = branchPath.last()
  const currentSelectedAnswer = dt.getSelectedOption(currentBranch)
  if (currentSelectedAnswer) {
    const newUrl = baseUrl + '/' + dtr.getUrlFromPairs(pairs)
    const next = currentSelectedAnswer.get('next')
    if (next) {
      return res.redirect(302, newUrl + '/' + next)
    }
  }

  const results = currentSelectedAnswer ? currentSelectedAnswer.get('result') : undefined

  const summary = dtr.getQuestionAnswerSummary(branchPath, baseUrl)

  if (results) {
    if (results.size === 1) {
      const result = results.get(0)
      const resultMeta = dtres.getFramework(frameworks, result)
      const resultTemplate = `frameworks/${result}.njk`
      const renderedResult = nunjucks.render('result.njk', {
        result,
        resultMeta,
        resultTemplate, 
        summary,
        serviceName,
        pageTitle: 'A result'
      })
      return res.send(renderedResult)
    }

    const resultList = results.map(r => {
      const result = dtres.getFramework(frameworks, r).toJS()
      result.nextUrl = currentUrl + '/' + r
      return result
    })

    const renderedResult = nunjucks.render('results.njk', {
      resultList,
      serviceName,
      summary
    })
    return res.send(renderedResult)
  }

  const id = 'decision-tree-' + currentBranch.get('ref')
  const radioOptions = {
    idPrefix: id,
    name: 'decision-tree',
    fieldset: {
      legend: {
        text: currentBranch.get('title'),
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    }
  }

  const hint = currentBranch.get('hint')
  if (hint) {
    radioOptions.hint = { text: hint }
  }

  radioOptions.items = currentBranch.get('options').map(option => {
    const optionUrl = [currentUrl, option.get('ref'), option.get('next')]
    const optionHint = option.get('hint')
    return {
      value: optionUrl.join('/'),
      text: option.get('title'),
      hint: optionHint ? { text: optionHint } : null
    }
  })

  
  if (radioOptions.items.getIn([0, 'text']) !== 'Yes'){
    radioOptions.items = radioOptions.items.sortBy(item => item.text)
  }  

  let err = null
  if (urlInfo.search) {
    const errMsg = currentBranch.get('err') || 'Please choose an option'
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

  const prefix = currentBranch.get('prefix')
   // ? nunjucks.render(currentBranch.get('prefix')) : ''
  const suffix = currentBranch.get('suffix') ? nunjucks.render(currentBranch.get('suffix')) : ''

  const pageTitle = err ? 'Error: ' + currentBranch.get('title') : currentBranch.get('title')

  const render = nunjucks.render('question.njk', { 
    currentUrl, 
    currentBranch, 
    radioOptions, 
    err,
    summary, 
    branchPath,
    baseUrl,
    suffix,
    prefix,
    serviceName,
    pageTitle
  })
  res.send(render)
})

app.get('*', (req, res) => {
  const render = nunjucks.render('page.njk')
  res.send(render)
})

app.listen(port, function () {
  console.log('Magic happens on port ' + port)
})
