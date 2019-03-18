const url = require('url')
const path = require('path')

const dt = require('./decisionTree/decisionTree')


const redirectToQuestion = app => (req, res) => {
  const { tree } = app.locals
  const { urlBits, urlInfo } = res.locals
  const questionRef = urlBits[urlBits.length -2]
  const answerRef = urlBits[urlBits.length -1]

  const branch = dt.getBranch(tree, questionRef)
  const answer = dt.getOption(branch, answerRef)
  const nxt = answer.get('next')
  const nxtUrl = path.join(urlInfo.pathname, nxt)
  return res.redirect(302, nxtUrl)
}

const redirectToResult = app => (req, res) => {
  const { tree } = app.locals
  const { urlBits, urlInfo } = res.locals
  const questionRef = urlBits[urlBits.length -2]
  const answerRef = urlBits[urlBits.length -1]

  const branch = dt.getBranch(tree, questionRef)
  const answer = dt.getOption(branch, answerRef)
  const result = answer.getIn(['result', 0])
  const nxtUrl = path.join(urlInfo.pathname, result)
  return res.redirect(302, nxtUrl)
}

const redirectIfAnswered = (req, res, next) => {
  if (req.query && req.query['decision-tree']) {
    return res.redirect(302, req.query['decision-tree'])
  }
  next()
}

module.exports = {
  redirectToQuestion,
  redirectToResult,
  redirectIfAnswered
}