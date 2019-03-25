const express = require('express')
const serveStatic = require('serve-static')
const nunjucks = require('nunjucks')
const path = require('path')
const url = require('url')
const port = process.env.PORT || 5000

const app = express()
const basicAuth = require('express-basic-auth')

const authUser = process.env.AUTHUSER || null
const authPass = process.env.AUTHPASS || null
if (authUser && authPass) {
  const auth = { users: {}, challenge: true }
  auth.users[authUser] = authPass
  app.use(basicAuth(auth))
}

const dtr = require('./decisionTree/decisionTreeRoute')
const dtres = require('./decisionTree/decisionTreeResults')
const dt = require('./decisionTree/decisionTree')


const tree = dt.makeTree(require('./tree.json'))
const frameworks = dtres.makeFrameworks(require('./frameworks.json'))

const serviceName = 'Find a DfE approved framework for your school'
const frameworkPath = '/frameworks'
app.locals = {
  serviceName,
  frameworkPath,
  tree,
  frameworks
}

const resultPage = require('./resultPage')(app)
const redirects = require('./redirects')
const redirectToResult = redirects.redirectToResult(app)
const redirectToQuestion = redirects.redirectToQuestion(app)
const redirectIfAnswered = redirects.redirectIfAnswered
const multiplePage = require('./multiplePage')(app)
const questionPage = require('./questionPage')(app)

nunjucks.configure(path.resolve(__dirname, './templates'))

nunjucks.configure([
  path.resolve(__dirname, './templates'),
  path.resolve(__dirname, '../node_modules/govuk-frontend/'),
  path.resolve(__dirname, '../node_modules/govuk-frontend/components/')
], {
  autoescape: true
})

const getSummary = (req) => {
  const pairs = dtr.getQuestionAnswerPairSlugs(req.url.substr(frameworkPath.length))
  const branchPath = dtr.getBranchPath(tree, pairs)
  return dtr.getQuestionAnswerSummary(branchPath, frameworkPath)
}

const allPaths = dt.getAllBranchPaths(tree)

app.use(serveStatic('public/', { 'index': ['index.html'] }))

app.get('/', (req, res, next) => {
  const render = nunjucks.render('start-page.njk', {
    serviceName,
    pageTitle: serviceName
  })
  res.send(render)
})

app.get('/benefits', (req, res, next) => {
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

app.get('/how-to-use-ypo-framework', (req, res) => {
  const render = nunjucks.render('how-to-use/ypo-electricity.njk', {
    serviceName,
    pageTitle: 'How to use the YPO framework'
  })
  res.send(render)
})

app.get('/how-to-use-espo-framework', (req, res) => {
  const render = nunjucks.render('how-to-use/espo.njk', {
    serviceName,
    pageTitle: 'How to use the ESPO framework'
  })
  res.send(render)
})

app.get('/guidance/electricity', (req, res) => {
  const render = nunjucks.render('guidance/electricity.njk', {
    serviceName,
    pageTitle: 'Buying electricity for your school'
  })
  res.send(render)
})

app.get(`${frameworkPath}*`, (req, res, next) => {
  const urlInfo = url.parse(req.url)
  const trimmedSlashes = urlInfo.pathname.replace(/^\/+|\/+$/g, '')
  const urlBits = trimmedSlashes.split('/')
  res.locals.urlInfo = urlInfo
  res.locals.trimmedSlashes = trimmedSlashes
  res.locals.urlBits = urlBits
  res.locals.summary = getSummary(req)
  next()
})

allPaths.questions.forEach(q => {
  app.get(path.join(frameworkPath, q), redirectIfAnswered)
  app.get(path.join(frameworkPath, q), questionPage)
})

allPaths.redirectToQuestion.forEach(a => {
  app.get(path.join(frameworkPath, a), redirectToQuestion)
})

allPaths.redirectToResult.forEach(a => {
  app.get(path.join(frameworkPath, a), redirectToResult)
})

allPaths.multiple.forEach(m => {
  app.get(path.join(frameworkPath, m), multiplePage)
})

allPaths.results.forEach(r => {
  app.get(path.join(frameworkPath, r), resultPage)
})

app.get(frameworkPath, (req, res) => {
  res.redirect(302, path.join(frameworkPath, tree.getIn([0, 'ref'])))
})

app.get('*', (req, res) => {
  const render = nunjucks.render('404.njk')
  res.status(404)
  res.send(render)
})

const server = app.listen(port, function () {
  console.log('Magic happens on port ' + port)
})

module.exports = {
  server
}