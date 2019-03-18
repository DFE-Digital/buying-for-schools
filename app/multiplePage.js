const url = require('url')
const path = require('path')
const nunjucks = require('nunjucks')

const dt = require('./decisionTree/decisionTree')

const multiplePage = app => (req, res) => {
  const { tree, serviceName, frameworks, frameworkPath } = app.locals
  const { urlBits, urlInfo, summary } = res.locals

  const questionRef = urlBits[urlBits.length -2]
  const answerRef = urlBits[urlBits.length -1]
  const branch = dt.getBranch(tree, questionRef)
  const answer = dt.getOption(branch, answerRef)
  const results = answer.get('result').sortBy(r => Math.random())
  const resultList = results.map(r => {
    const result = frameworks.find(framework => framework.get('ref') === r)
    const resultJS = result.toJS()
    resultJS.nextUrl = path.join(req.url, r)
    return resultJS
  })

  const renderedResult = nunjucks.render('results.njk', {
    resultList,
    serviceName,
    summary,
    frameworkPath,
    pageTitle: 'Matching frameworks'
  })
  return res.send(renderedResult)
}

module.exports = multiplePage