const querystring = require("querystring")
const nunjucks = require('nunjucks')
const url = require('url')

const resultPage = app => (req, res) => {
  const { frameworkPath, serviceName } = app.locals
  const { trimmedSlashes, urlInfo, urlBits, summary } = res.locals
  const questionRef = urlBits[urlBits.length -3]
  const answerRef = urlBits[urlBits.length -2]
  const resultRef = urlBits[urlBits.length -1]

  const frameworks = app.locals.frameworks
  const resultMeta = frameworks.get(resultRef).toObject()

  const resultTemplate = `frameworks/${resultRef}.njk`
  const renderedResult = nunjucks.render(resultTemplate, {
    result : resultRef,
    resultMeta,
    resultTemplate,
    summary,
    locals: app.locals,
    pageTitle: resultMeta.title
  })
  return res.send(renderedResult)
}

module.exports = resultPage