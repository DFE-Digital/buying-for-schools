const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const url = require('url')
const port = process.env.PORT || 5000

const app = express()

const auth = require('./auth.js')(app)

const dtr = require('./decisionTree/decisionTreeRoute')
const dtres = require('./decisionTree/decisionTreeResults')
const dt = require('./decisionTree/decisionTree')

// const tree = dt.makeTree(require('./tree.json'))
const frameworks = dtres.makeFrameworks(require('./frameworks.json'))
const categories = require('./categories.json')
// const allPaths = dt.getAllBranchPaths(tree)

const tree = require('./decisionTree/tree')(require('./tree.json'))
// const b = tt.getBranch('type')
// console.log(tt.getAllPaths())
// console.log(b.toObject())
// console.log(b.getOption('buying').toObject())
// const o = b.getOption('buy')


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