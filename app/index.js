const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const url = require('url')
const port = process.env.PORT || 5000

const app = express()
const auth = require('./auth.js')(app)

const nunjucks = require('./nunjucksConfig')(app)

const dtr = require('./decisionTree/decisionTreeRoute')
const dtres = require('./decisionTree/decisionTreeResults')
const dt = require('./decisionTree/decisionTree')

const tree = dt.makeTree(require('./tree.json'))
const frameworks = dtres.makeFrameworks(require('./frameworks.json'))
const allPaths = dt.getAllBranchPaths(tree)

const serviceName = 'Find a DfE approved framework for your school'
const frameworkPath = '/frameworks'
app.locals = {
  serviceName,
  frameworkPath,
  tree,
  frameworks,
  allPaths
}

app.use(serveStatic('public/', { 'index': ['index.html'] }))

const routeBasicPages = require('./routeBasicPages')(app)
const routeIntroPages = require('./routeIntroPages')(app)
const routeGuidancePages = require('./routeGuidancePages')(app)
routeBasicPages(routeIntroPages)
routeBasicPages(routeGuidancePages)

const routeDecisionTreePages = require('./routeDecisionTreePages')(app)

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



app.get('*', (req, res) => {
  const render = nunjucks.render('404.njk')
  res.status(404)
  res.send(render)
})

const server = app.listen(port, () => {
  console.log('Magic happens on port ' + port)
})

module.exports = {
  server
}