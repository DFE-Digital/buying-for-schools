const url = require('url')
const path = require('path')

const handleRequest = app => {
  const dbTreeQuestion = require('./dbTreeQuestion')(app)
  const dbTreeFramework = require('./dbTreeFramework')(app)
  const dbTreeMultiple = require('./dbTreeMultiple')(app)

  return (req, res) => {
    const db = app.locals.db

    const getQuestionAnswerPairSlugs = (url) => {
      const trimmed = url.replace(/^\/+|\/+$/g, '')
      if (!trimmed) {
        return []
      }
      const trimmedSlashes = trimmed.split('/')
      const pairs = []
      while (trimmedSlashes.length) {
        const newPair = [trimmedSlashes.shift()]
        if (trimmedSlashes.length) {
          newPair.push(trimmedSlashes.shift())
        }
        pairs.push(newPair)
      }
      return pairs
    }

    const getPair = (doc, pair) => {
      const question = doc.question.find(q => q.ref === pair[0])
      const answer = question ? question.options.find(a => a.ref === pair[1]) : null
      return { question, answer }
    }

    const render = res => {
      const { lastPairDetail, frameworkDetails, nextDetails } = res.locals
      if (frameworkDetails.length === 1) {
        return res.send(dbTreeFramework(frameworkDetails[0], res.locals.summary))
      }
      if (frameworkDetails.length) {
        return dbTreeMultiple(req, res)
      }

      if (lastPairDetail.question && lastPairDetail.answer && nextDetails) {
        return res.redirect(302, path.join(req.originalUrl, nextDetails.ref))
      }

      if (lastPairDetail.question && lastPairDetail.answer) {
        return res.send('DEADEND')
      }

      if (lastPairDetail.question) {
        return dbTreeQuestion(req, res)
      }

      res.send({ render: 'UNKNOWN', data: res.locals })
    }

    const getQuestionAnswerSummary = (pairDetail) => {
      const summary = []
      const url = []

      pairDetail.forEach(pair => {
        const { question, answer } = pair
        if (!question || !answer) {
          return summary
        }

        url.push(question.ref)
        summary.push({
          key: { text: question.title },
          value: { text: answer.title },
          actions: {
            items: [{
              href: req.baseUrl + '/' + url.join('/'),
              text: 'Change',
              visuallyHiddenText: question.title
            }]
          }
        })
        url.push(answer.ref)
      })
      return summary
    }

    // redirect if answered
    if (req.query && req.query['decision-tree']) {
      return res.redirect(302, req.query['decision-tree'])
    }

    res.locals.urlInfo = url.parse(req.url)

    const pairs = getQuestionAnswerPairSlugs(res.locals.urlInfo.pathname)
    if (!pairs.length) {
      return res.redirect(302, path.join(req.baseUrl, 'what'))
    }

    const lastPair = pairs[pairs.length - 1]
    res.locals.pairs = pairs

    let doc
    db.getRecord('DRAFT')
      .then(d => doc = d)
      .then(() => pairs.map(p => getPair(doc, p)))
      .then(pairDetail => {
        const lastPairDetail = pairDetail[pairDetail.length - 1]
        res.locals.lastPairDetail = lastPairDetail
        res.locals.pairDetail = pairDetail
        res.locals.summary = getQuestionAnswerSummary(pairDetail)

        if (!lastPairDetail.question) {
        // look for a single recommendation
          return doc.framework.find(f => f.ref === lastPair[0])
        }
        if (lastPairDetail.question && lastPairDetail.answer) {
        // if there are recommendations at the end of the chain
          if (lastPairDetail.answer.next) {
            return doc.question.find(q => q._id.toString() === lastPairDetail.answer.next.toString())
          } else {
            return doc.framework.filter(f => lastPairDetail.answer.result.includes(f._id.toString()))
          }
        }
        return []
      }).then(nextDetails => {
        if (nextDetails && nextDetails.options) {
          res.locals.nextDetails = nextDetails
          res.locals.frameworkDetails = []
        } else {
          const frameworks = nextDetails && nextDetails._id ? [nextDetails] : nextDetails
          res.locals.frameworkDetails = frameworks.map(f => db.populateFramework(doc, f))
        }

        render(res)
      })
      .catch(err => {
        console.log('err', err)
        res.send(res.locals)
      })
  }
}

module.exports = handleRequest
