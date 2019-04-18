const path = require('path')

const uniq = arr => {
  return arr.filter((v, i, self) => self.indexOf(v) === i)
}

const getAllBranchPaths = (tree) => {
  const questionPaths = []
  const redirectToQuestionPaths = []
  const redirectToResultPaths = []
  const resultPaths = []
  const multiplePaths = []
 
  const recursion = (basePath, qref) => {
    const branch = tree.getBranch(qref)
    const questionPath = path.join(basePath, qref)
    const options = branch.getOptions()
    questionPaths.push(questionPath)
    options.forEach(opt => {
      const answerPath = path.join(questionPath, opt.getRef())
      const nxt = opt.getNext()
      const results = opt.getResult()
      if (nxt) {
        redirectToQuestionPaths.push(answerPath)
        recursion(answerPath, nxt)
      }
      if (results) {
        if (results.length === 1) {
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

  recursion('', tree.getFirst().getRef())
  return {
    questions: uniq(questionPaths),
    redirectToQuestion: uniq(redirectToQuestionPaths),
    redirectToResult: uniq(redirectToResultPaths),
    results: uniq(resultPaths),
    multiple: uniq(multiplePaths)
  }
}

const getQuestionAnswerSummary = (tree, pairs, baseUrl) => {
  const summary = []
  const url = []
  Object.keys(pairs).forEach(questionRef => {
    const answerRef = pairs[questionRef]
    const branch = tree.getBranch(questionRef)
    if (!branch) {
      return summary
    }
    const selectedOption = branch.getOption(answerRef)
    url.push(questionRef)
    if (selectedOption) {
      summary.push({
        key: { text: branch.getTitle() },
        value: { text: selectedOption.getTitle() },
        actions: {
          items: [{
            href: baseUrl + '/' + url.join('/'),
            text: 'Change',
            visuallyHiddenText: branch.getTitle()
          }]
        }
      })
      url.push(selectedOption.getRef())
    }
  })

  return summary
}

module.exports = {
  getAllBranchPaths,
  getQuestionAnswerSummary
}