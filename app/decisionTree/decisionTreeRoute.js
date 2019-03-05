/* global Map:true */
const { fromJS, List, Map } = require('immutable')
const dt = require('./decisionTree')

const getQuestionAnswerPairSlugs = (url) => {
  const trimmedSlashes = url.replace(/^\/+|\/+$/g, '')
  if (trimmedSlashes === '') {
    return fromJS({})
  } 
  const urlPaths = trimmedSlashes.split('/')
  const keys = urlPaths.filter((p, i) => i % 2 === 0)
  const vals = urlPaths.filter((p, i) => i % 2 === 1)
  const pairs = {}
  keys.forEach((k, i) => {
    pairs[k] = (i < vals.length) ? vals[i] : undefined
  })
  return fromJS(pairs)
}

const getUrlFromPairs = (pairs) => {
  let url = []
  pairs.forEach((v, k) => {
    url.push(k)
    if (v) {
      url.push(v)
    }
  })
  return url.join('/')
}

const getBranchPath = (tree, pairs) => {
  let branches = List()
  pairs.forEach((answerRef, questionRef) => {
    let branch = dt.getBranch(tree, questionRef)
    if (branch) {
      branch = dt.setSelectedOption(branch, answerRef)
      branches = branches.push(branch)
    }
  })
  return branches
}

const validateQuestionAnswerPairs = (tree, pairs) => {
  const questionRefs = pairs.keySeq(k => k)
  const answerRefs = pairs.valueSeq(v => v)
  if (questionRefs.size === 0) {
    return false
  }
  return questionRefs.every((questionRef, i) => {
    const branch = dt.getBranch(tree, questionRef)
    const answerRef = answerRefs.get(i)
    // console.log(questionRef, i, branch, answerRef)
    if (!branch) {
      // no branch with given ref
      return false
    }

    if (answerRef === undefined) {
      // question branch is valid but not answered
      return true
    }

    const answeredOption = dt.getOption(branch, answerRef)
    if (!answeredOption) {
      // answer given was not available here
      return false
    }

    if (i === questionRefs.size - 1) {
      // at the end of the question pairs
      return true
    }

    const next = answeredOption.get('next')
    if (next !== questionRefs.get(i + 1)) {
      // answer does not match with the next question
      return false
    }

    // default
    return true
  })
}

const getSanitisedQuestionAnswerPairs = (tree, pairs) => {
  const questionRefs = pairs.keySeq(k => k)
  const answerRefs = pairs.valueSeq(v => v)
  let newPairs = pairs
  if (answerRefs.last() === undefined) {
    // last question was unanswered so if here then the question itself must be invalid
    newPairs = pairs.delete(questionRefs.last())
  } else {
    newPairs = pairs.set(questionRefs.last(), undefined)
  }

  if (newPairs.size === 0) {
    const treeStart = tree.first().get('ref')
    return Map().set(treeStart, undefined)
  }

  const valid = validateQuestionAnswerPairs(tree, newPairs)
  if (valid) {
    return newPairs
  }

  return getSanitisedQuestionAnswerPairs(tree, newPairs)
}

const getQuestionAnswerSummary = (branchPath, baseUrl) => {
  let summary = List()
  let url = List()
  branchPath.forEach(branch => {
    url = url.push(branch.get('ref'))
    const selectedOption = dt.getSelectedOption(branch)
    if (selectedOption) {
      summary = summary.push({
        key: { text: branch.get('title') },
        value: { text: selectedOption.get('title') },
        actions: {
          items: [{
            href: baseUrl + '/' + url.join('/'),
            text: 'Change',
            visuallyHiddenText: branch.get('title')
          }]

        }
      })
      url = url.push(selectedOption.get('ref'))
    }
  })

  return summary
}

module.exports = {
  getQuestionAnswerPairSlugs,
  getUrlFromPairs,
  getBranchPath,
  validateQuestionAnswerPairs,
  getSanitisedQuestionAnswerPairs,
  getQuestionAnswerSummary
}
