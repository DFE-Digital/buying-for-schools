const path = require('path')
const { fromJS } = require('immutable')

const uniq = arr => {
  return arr.filter((v, i, self) => self.indexOf(v) === i)
}

const makeTree = treeJson => {
  return fromJS(treeJson)
}

const getBranch = (tree, branchRef) => {
  return tree.find(branch => branch.get('ref') === branchRef)
}

const getOption = (branch, optionRef) => {
  return branch.get('options').find(option => option.get('ref') === optionRef)
}

const getOptionKey = (branch, optionRef) => {
  return branch.get('options').findKey(option => option.get('ref') === optionRef)
}

const getSelectedOption = (branch) => {
  return branch.get('options').find(option => {
    return option.get('selected') === true
  })
}

const setSelectedOption = (branch, optionRef) => {
  if (optionRef === undefined) {
    return branch
  }
  const optionKey = getOptionKey(branch, optionRef)
  if (optionKey === undefined) {
    return branch
  }
  return branch.setIn(['options', optionKey, 'selected'], true)
}

const getAllBranchPaths = (thetree, ref) => {
  const questionPaths = []
  const redirectToQuestionPaths = []
  const redirectToResultPaths = []
  const resultPaths = []
  const multiplePaths = []
  
  if (!ref) {
    ref = thetree.getIn([0, 'ref'])
    console.log(ref)
  }
  const recursion = (basePath, qref) => {
    const branch = getBranch(thetree, qref)
    const questionPath = path.join(basePath, qref)
    const options = branch.get('options')
    questionPaths.push(questionPath)
    options.forEach(opt => {
      const answerPath = path.join(questionPath, opt.get('ref'))
      const nxt = opt.get('next')
      const results = opt.get('result')
      if (nxt) {
        redirectToQuestionPaths.push(answerPath)
        recursion(answerPath, nxt)
      }
      if (results) {
        if (results.size === 1) {
          redirectToResultPaths.push(answerPath)
        } else {
          multiplePaths.push(answerPath)
        }
        results.forEach(res => {
          resultPaths.push(path.join(answerPath, res))
        })
      }
    })
  }

  recursion('', ref)
  return {
    questions: uniq(questionPaths),
    redirectToQuestion: uniq(redirectToQuestionPaths),
    redirectToResult: uniq(redirectToResultPaths),
    results: uniq(resultPaths),
    multiple: uniq(multiplePaths)
  }
}

module.exports = {
  makeTree,
  getBranch,
  getOption,
  getOptionKey,
  getSelectedOption,
  setSelectedOption,
  getAllBranchPaths
}
