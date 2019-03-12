const express = require('express')
const serveStatic = require('serve-static')
const nunjucks = require('nunjucks')
const path = require('path')
const dtr = require('./decisionTree/decisionTreeRoute')
const dtres = require('./decisionTree/decisionTreeResults')
const dt = require('./decisionTree/decisionTree')
const url = require('url')

const app = express()
const basicAuth = require('express-basic-auth')

const authUser = process.env.AUTHUSER || null
const authPass = process.env.AUTHPASS || null
if (authUser && authPass) {
  const auth = { users: {}, challenge: true }
  auth.users[authUser] = authPass
  app.use(basicAuth(auth))
}
const port = process.env.PORT || 5000

const tree = dt.makeTree(require('./tree.json'))
const frameworks = dtres.makeFrameworks(require('./frameworks.json'))

const serviceName = 'Find a DfE approved framework for your school'
const frameworkPath = '/frameworks'

nunjucks.configure(path.resolve(__dirname, './templates'))

nunjucks.configure([
  path.resolve(__dirname, './templates'),
  path.resolve(__dirname, '../node_modules/govuk-frontend/'),
  path.resolve(__dirname, '../node_modules/govuk-frontend/components/')
], {
  autoescape: true
})

app.use(serveStatic('public/', { 'index': ['index.html'] }))

app.get('/', (req, res, next) => {
  const render = nunjucks.render('framework-benefits.njk', {
    serviceName,
    pageTitle: 'Benefits of using a framework'
  })
  res.send(render)
})

app.get('/selection', (req, res, next) => {
  const render = nunjucks.render('framework-selection.njk', {
    serviceName,
    pageTitle: 'How frameworks are selected'
  })
  res.send(render)
})

app.get('/service-output', (req, res, next) => {
  const render = nunjucks.render('service-output.njk', {
    serviceName,
    pageTitle: 'After you’ve used the service'
  })
  res.send(render)
})

const getSummary = (req) => {
  const pairs = dtr.getQuestionAnswerPairSlugs(req.url.substr(frameworkPath.length))
  const branchPath = dtr.getBranchPath(tree, pairs)
  return dtr.getQuestionAnswerSummary(branchPath, frameworkPath)
}

const questionPage = (req, res) => {
  if (req.query && req.query['decision-tree']) {
    return res.redirect(302, req.query['decision-tree'])
  }
  const baseUrl = req.baseUrl
  const urlInfo = url.parse(req.url)
  const trimmedSlashes = urlInfo.pathname.replace(/^\/+|\/+$/g, '')
  const urlBits = trimmedSlashes.split('/')
  const questionRef = urlBits[urlBits.length -1]
  const branch = dt.getBranch(tree, questionRef)
  const id = 'decision-tree-' + questionRef
  const radioOptions = {
    idPrefix: id,
    name: 'decision-tree',
    fieldset: {
      legend: {
        text: branch.get('title'),
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    }
  }

  const hint = branch.get('hint')
  if (hint) {
    radioOptions.hint = { text: hint }
  }

  radioOptions.items = branch.get('options').map(option => {
    const optionUrl = path.join(urlInfo.pathname, option.get('ref'))
    const optionHint = option.get('hint')
    return {
      value: optionUrl,
      text: option.get('title'),
      hint: optionHint ? { text: optionHint } : null
    }
  })

  
  if (radioOptions.items.getIn([0, 'text']) !== 'Yes'){
    radioOptions.items = radioOptions.items.sortBy(item => item.text)
  }  

  let err = null
  if (urlInfo.search) {
    const errMsg = branch.get('err') || 'Please choose an option'
    radioOptions.errorMessage = { text: errMsg }
    err = {
      titleText: "There is a problem",
      errorList: [
        {
          text: errMsg,
          href: `#${id}-1`
        }
      ]
    }
  }

  const prefix = branch.get('prefix')
   // ? nunjucks.render(branch.get('prefix')) : ''
  const suffix = branch.get('suffix') ? nunjucks.render(branch.get('suffix')) : ''

  const pageTitle = err ? 'Error: ' + branch.get('title') : branch.get('title')
  const summary = getSummary(req)

  const render = nunjucks.render('question.njk', { 
    branch, 
    radioOptions, 
    err,
    summary, 
    baseUrl,
    suffix,
    prefix,
    serviceName,
    pageTitle
  })
  res.send(render)
}

const redirectToQuestion = (req, res) => {
  const urlInfo = url.parse(req.url)
  const trimmedSlashes = urlInfo.pathname.replace(/^\/+|\/+$/g, '')
  const urlBits = trimmedSlashes.split('/')
  const questionRef = urlBits[urlBits.length -2]
  const answerRef = urlBits[urlBits.length -1]

  const branch = dt.getBranch(tree, questionRef)
  const answer = dt.getOption(branch, answerRef)
  const nxt = answer.get('next')
  const nxtUrl = path.join(urlInfo.pathname, nxt)
  return res.redirect(302, nxtUrl)
}

const redirectToResult = (req, res) => {
  const urlInfo = url.parse(req.url)
  const trimmedSlashes = urlInfo.pathname.replace(/^\/+|\/+$/g, '')
  const urlBits = trimmedSlashes.split('/')
  const questionRef = urlBits[urlBits.length -2]
  const answerRef = urlBits[urlBits.length -1]

  const branch = dt.getBranch(tree, questionRef)
  const answer = dt.getOption(branch, answerRef)
  const result = answer.getIn(['result', 0])
  const nxtUrl = path.join(urlInfo.pathname, result)
  return res.redirect(302, nxtUrl)
}

const multiplePage = (req, res) => {
  const urlInfo = url.parse(req.url)
  const trimmedSlashes = urlInfo.pathname.replace(/^\/+|\/+$/g, '')
  const urlBits = trimmedSlashes.split('/')
  const questionRef = urlBits[urlBits.length -2]
  const answerRef = urlBits[urlBits.length -1]
  const branch = dt.getBranch(tree, questionRef)
  const answer = dt.getOption(branch, answerRef)
  const results = answer.get('result').sortBy(r => Math.random())
  const summary = getSummary(req)
  const resultList = results.map(r => {
    const result = dtres.getFramework(frameworks, r).toJS()
    result.nextUrl = path.join(req.url, r)
    return result
  })

  const renderedResult = nunjucks.render('results.njk', {
    resultList,
    serviceName,
    summary,
    pageTitle: 'Matching frameworks'
  })
  return res.send(renderedResult)
}

const resultPage = (req, res) => {
  const trimmedSlashes = req.url.replace(/^\/+|\/+$/g, '')
  const urlInfo = url.parse(req.url)
  const urlBits = trimmedSlashes.split('/')
  const questionRef = urlBits[urlBits.length -3]
  const answerRef = urlBits[urlBits.length -2]
  const resultRef = urlBits[urlBits.length -1]

  const summary = getSummary(req)
  const resultMeta = dtres.getFramework(frameworks, resultRef)
  const resultTemplate = `frameworks/${resultRef}.njk`
  const renderedResult = nunjucks.render(resultTemplate, {
    result : resultRef,
    resultMeta,
    resultTemplate, 
    summary,
    serviceName,
    pageTitle: resultMeta.get('title')
  })
  return res.send(renderedResult)
}

const allPaths = dt.getAllBranchPaths(tree)

allPaths.questions.forEach(q => {
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
  res.redirect(302, path.join(frameworkPath, tree.getIn([0, 'ref'])))
})

app.get('*', (req, res) => {
  const render = nunjucks.render('page.njk')
  res.send(render)
})

app.listen(port, function () {
  console.log('Magic happens on port ' + port)
})
