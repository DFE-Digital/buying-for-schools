const url = require('url')
const path = require('path')

const redirectToQuestion = app => (req, res) => {
  const { tree } = app.locals
  const { urlBits, urlInfo } = res.locals
  const questionRef = urlBits[urlBits.length -2]
  const answerRef = urlBits[urlBits.length -1]

  const branch = tree.getBranch(questionRef)
  const answer = branch.getOption(answerRef)
  const nxt = answer.getNext()
  const nxtUrl = path.join(urlInfo.pathname, nxt)
  return res.redirect(302, nxtUrl)
}

const redirectToResult = app => (req, res) => {
  const { tree } = app.locals
  const { urlBits, urlInfo } = res.locals
  const questionRef = urlBits[urlBits.length -2]
  const answerRef = urlBits[urlBits.length -1]

  const branch = tree.getBranch(questionRef)
  const answer = branch.getOption(answerRef)
  const result = answer.getResult()[0]
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