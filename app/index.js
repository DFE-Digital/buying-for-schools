const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const url = require('url')
const port = process.env.PORT || 4000
const app = express()

const auth = require('./auth.js')(app)

const frameworks = require('./decisionTree/frameworks').makeFrameworks(require('./data/frameworks.json'))
const tree = require('./decisionTree/tree').makeTree(require('./data/tree.json'))
const categories = require('./data/categories.json')

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


app.use((req, res, next) => {
  if (process.env.AVAILABLE === 'FALSE') {
    const render = nunjucks.render('unavailable.njk', { locals: app.locals })
    res.status(503)
    res.send(render)
    return
  }
  next()
})

const routeBasicPages = require('./routeBasicPages')(app)
const routeIntroPages = require('./routeIntroPages')(app)
// const routeGuidancePages = require('./routeGuidancePages')(app)
const routeHowToUsePages = require('./routeHowToUsePages')(app)
routeBasicPages(routeIntroPages)
// routeBasicPages(routeGuidancePages)
routeBasicPages(routeHowToUsePages)

const routeDecisionTreePages = require('./routeDecisionTreePages')(app)
const routeDealsPages = require('./dealsPage').routeDealsPage(app)

app.locals.db = require('./dbTree/db')
const dbTree = require('./dbTree/dbTree')(app)
app.use('/find', dbTree)
app.use('/list', dbTree)


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