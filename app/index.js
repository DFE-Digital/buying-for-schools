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

const authUser = process.env.AUTHUSER || 'test'
const authPass = process.env.AUTHPASS || 'test'
if (authUser && authPass) {
  const auth = { users: {}, challenge: true }
  auth.users[authUser] = authPass
  app.use(basicAuth(auth))
}
const port = process.env.PORT || 3000

const tree = dt.makeTree(require('./tree.json'))
const frameworks = dtres.makeFrameworks(require('./frameworks.json'))

nunjucks.configure(path.resolve(__dirname, './templates'))

nunjucks.configure([
  path.resolve(__dirname, './templates'),
  path.resolve(__dirname, '../node_modules/govuk-frontend/'),
  path.resolve(__dirname, '../node_modules/govuk-frontend/components/')
], {
  autoescape: true
})

app.use(serveStatic('public/', { 'index': ['index.html'] }))

app.use('/frameworks', (req, res, next) => {
  const urlInfo = url.parse(req.url)
  const pairs = dtr.getQuestionAnswerPairSlugs(urlInfo.pathname)
  const baseUrl = req.baseUrl

  if (req.query && req.query['decision-tree']) {
    return res.redirect(302, req.query['decision-tree'])
  }

  if (!dtr.validateQuestionAnswerPairs(tree, pairs)) {
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

  const result = currentSelectedAnswer ? currentSelectedAnswer.get('result') : undefined

  const summary = dtr.getQuestionAnswerSummary(branchPath, baseUrl)

  if (result) {
    const resultMeta = dtres.getFramework(frameworks, result)
    const template = resultMeta ? resultMeta.get('template') : undefined
    const resultTemplate = template ? `frameworks/${template}.njk` : undefined
    const renderedResult = nunjucks.render('result.njk', {result, resultTemplate, summary})
    return res.send(renderedResult)
  }

  const radioOptions = {
    idPrefix: 'decision-tree-' + currentBranch.get('ref'),
    name: 'decision-tree',
    fieldset: {
      legend: {
        text: currentBranch.get('title'),
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--xl'
      }
    }
  }

  radioOptions.items = currentBranch.get('options').map(option => {
    const optionUrl = [currentUrl, option.get('ref'), option.get('next')]
    return {
      value: optionUrl.join('/'),
      text: option.get('title')
    }
  })

  if (urlInfo.search) {
    radioOptions.errorMessage = { text: 'Please choose an option' }
  }

  const render = nunjucks.render('question.njk', { pairs, currentUrl, currentBranch, radioOptions, summary, branchPath, JSON, result, baseUrl })
  res.send(render)
})

app.get('*', (req, res) => {
  const render = nunjucks.render('page.njk')
  res.send(render)
})

app.listen(port, function () {
  console.log('Magic happens on port ' + port)
})
