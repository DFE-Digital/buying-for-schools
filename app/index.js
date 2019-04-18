const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const url = require('url')
const port = process.env.PORT || 5000

const app = express()

const auth = require('./auth.js')(app)

const frameworks = require('./decisionTree/frameworks')(require('./frameworks.json'))
const tree = require('./decisionTree/tree')(require('./tree.json'))
const categories = require('./categories.json')

const serviceName = 'Find a DfE approved framework for your school'
const frameworkPath = '/frameworks'
app.locals = {
  serviceName,
  frameworkPath,
  tree,
  frameworks,
  categories,
  survey: process.env.SURVEY === 'YES'
}

const nunjucks = require('./nunjucksConfig')(app)

app.use(serveStatic('public/', { 'index': ['index.html'] }))
const routeBasicPages = require('./routeBasicPages')(app)
const routeIntroPages = require('./routeIntroPages')(app)
const routeGuidancePages = require('./routeGuidancePages')(app)
const routeHowToUsePages = require('./routeHowToUsePages')(app)
routeBasicPages(routeIntroPages)
routeBasicPages(routeGuidancePages)
routeBasicPages(routeHowToUsePages)

const routeDecisionTreePages = require('./routeDecisionTreePages')(app)
const routeDealsPages = require('./dealsPage')(app)


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