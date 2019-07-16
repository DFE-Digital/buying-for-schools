const url = require('url')
const path = require('path')
const models = require('../../../buying-for-schools-admin/api/models/models')(process.env.S107D01_MONGO_01_READONLY)

const handleRequest = app => (req, res) => {
  const dbTreeQuestion = require('./dbTreeQuestion')(app)
  const dbTreeFramework = require('./dbTreeFramework')(app)
  const dbTreeMultiple = require('./dbTreeMultiple')(app)

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

  const get = (what, criteria) => {
    return new Promise((resolve, reject) => {
      models[what].findOne(criteria, (err, result) => {
        if (err) {
          return reject(err)
        }
        return resolve(result)
      })
    })
  }


  const getPair = pair => {
    const result = {
      question: null,
      answer: null
    }
    return new Promise((resolve, reject) => {
      get('question', {ref: pair[0]}).then(res => {
        result.question = res
        if (res) {
          result.answer = res.options.find(opt => opt.ref === pair[1]) || null
        }
        return resolve(result)
      }).catch(err => {
        return reject(err)
      })
    })
  }

  const getFrameworks = criteria => {
    return new Promise((resolve, reject) => {
      models.framework.find(criteria)
      .populate('provider')
      .populate('cat')
      .exec((err, results) => {
        if (err) {
          return reject(err)
        }
        return resolve(results)
      })
    })
  }

  const getPairs = pairs => {
    const promiseList = []
    pairs.forEach(pair => {
      promiseList.push(getPair(pair))
    })
    return Promise.all(promiseList)
  }

  const render = res => {

    const { lastPairDetail, frameworkDetails, nextDetails } = res.locals

    if (frameworkDetails.length === 1) {
      return dbTreeFramework(req, res)
    }
    if (frameworkDetails.length) {
      return dbTreeMultiple(req, res)
      // return res.send({ render: 'MULTIPLE_FRAMEWORK', data: frameworkDetails } )
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
      // const answerRef = pairs[questionRef]
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


  models.question
  .find({ref: 'switching'})
  .populate({ path: 'options', populate: { path: 'result' }})
  .populate('options.next')
  .exec((err, results) => {
    console.log(err)
    console.log(JSON.stringify(results[0].options[0], null, '  '))
  })


  res.locals.urlInfo = url.parse(req.url)
  const pairs = getQuestionAnswerPairSlugs(res.locals.urlInfo.pathname)
  if (!pairs.length) {
    return res.redirect(302, path.join(req.baseUrl, 'what'))
  }

  const lastPair = pairs[pairs.length -1]
  res.locals.pairs = pairs


  getPairs(pairs).then(pairDetail => {
    const lastPairDetail = pairDetail[pairDetail.length -1]
    res.locals.lastPairDetail = lastPairDetail
    res.locals.pairDetail = pairDetail
    res.locals.summary = getQuestionAnswerSummary(pairDetail)

    if (!lastPairDetail.question) {
      // look for a single recommendation
      return getFrameworks({ref: lastPair[0]})
    }
    if (lastPairDetail.question && lastPairDetail.answer) {
      // if there are recommendations at the end of the chain
      if (lastPairDetail.answer.next) {
        return get('question', {_id: lastPairDetail.answer.next})
      } else {
        return getFrameworks({ _id: { $in: lastPairDetail.answer.result }})
      }
    }
    return []
  }).then(nextDetails => {
    if (nextDetails && nextDetails.options) {

      res.locals.nextDetails = nextDetails
      res.locals.frameworkDetails = []
    } else {
      res.locals.frameworkDetails = nextDetails && nextDetails._id ? [nextDetails] : nextDetails
    }

    render(res)
  })
  .catch(err => {
    console.log('err', err)
    res.send(res.locals)
  })
}

module.exports = handleRequest