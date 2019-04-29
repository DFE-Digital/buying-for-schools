const path = require('path')
const nunjucks = require('nunjucks')
const dtr = require('./decisionTree/decisionTreeRoute')
const url = require('url')
const treeUtils = require('./decisionTree/treeUtils')

const routeDecisionTreePages = app => {
  
  const { frameworkPath, tree } = app.locals
  const allPaths = tree.getAllPaths()

  const resultPage = require('./resultPage')(app)
  const redirects = require('./redirects')
  const redirectToResult = redirects.redirectToResult(app)
  const redirectToQuestion = redirects.redirectToQuestion(app)
  const redirectIfAnswered = redirects.redirectIfAnswered
  const multiplePage = require('./multiplePage')(app)
  const questionPage = require('./questionPage')(app)

  const getSummary = (req) => {
    const pairs = dtr.getQuestionAnswerPairSlugs(req.url.substr(frameworkPath.length))
    return treeUtils.getQuestionAnswerSummary(tree, pairs, frameworkPath)
  }

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

  console.log(allPaths.questions.length, 'questions')
  console.log(allPaths.redirectToQuestion.length, 'redirect to questions')
  console.log(allPaths.redirectToResult.length, 'redirect to result')
  console.log(allPaths.multiple.length, 'multiple results pages')
  console.log(allPaths.results.length, 'result pages')

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
    res.redirect(302, path.join(frameworkPath, tree.getFirst().getRef()))
  })
}

module.exports = routeDecisionTreePages