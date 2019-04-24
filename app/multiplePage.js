const url = require('url')
const path = require('path')
const nunjucks = require('nunjucks')

const multiplePage = app => (req, res, next) => {
  try {
    const { tree, serviceName, frameworks, frameworkPath } = app.locals
    const { urlBits, urlInfo, summary } = res.locals

    const questionRef = urlBits[urlBits.length -2]
    const answerRef = urlBits[urlBits.length -1]
    const branch = tree.getBranch(questionRef)
    const answer = branch.getOption(answerRef)
    const results = answer.getResult().sort((a, b) => Math.random())
    const resultList = results.map(r => {
      const result = frameworks.get(r)
      const resultJS = result.toObject()
      resultJS.nextUrl = path.join(req.url, r)
      return resultJS
    })

    const renderedResult = nunjucks.render('results.njk', {
      resultList,
      locals: app.locals,
      summary,
      frameworkPath,
      pageTitle: 'Matching frameworks'
    })
    return res.send(renderedResult)
  } catch (e) {
    next() 
  }
}

module.exports = multiplePage