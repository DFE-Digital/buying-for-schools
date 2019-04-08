/* global Map:true */
const { fromJS, List, Map } = require('immutable')
const dt = require('./decisionTree')
const dtres = require('./decisionTreeResults')

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
  getBranchPath,
  getQuestionAnswerSummary
}
