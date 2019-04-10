const path = require('path')

const uniq = arr => {
  return arr.filter((v, i, self) => self.indexOf(v) === i)
}

// const deepFreeze = (obj) => {
//   const propNames = Object.getOwnPropertyNames(obj)
//   for (let name of propNames) {
//     const value = obj[name]
//     obj[name] = (value && typeof value === "object") ? deepFreeze(value) : value
//   }
//   return Object.freeze(obj)
// }

const tree = (data) => {
  const branches = data.map(branchdata => makeBranch(branchdata))
  const tree = {
    getFirst: () => branches[0],
    getBranches: () => branches,
    getBranch: (branchRef) => {
      return branches.find(branch => branch.getRef() === branchRef)
    }
  }
  const allPaths = getAllBranchPaths(tree)
  tree.getAllPaths = () => allPaths
  return tree
}

const makeBranch = (data) => {
  const { ref, title, err } = data
  const options = data.options.map(optiondata => makeOption(optiondata))
  return {
    getRef:     () => ref,
    getTitle:   () => title,
    getErr:     () => err,
    getOptions: () => options,
    getOption: (optionRef) => {
      return options.find(option => option.getRef() === optionRef)
    },
    toObject: () => {
      const jsOptions = options.map(opt => opt.toObject())
      return {
        ref,
        title,
        err,
        jsOptions
      }
    }
  }
}

const makeOption = (data) => {
  const { ref, title, next, result } = data
  return {
    getRef:    () => ref,
    getTitle:  () => title,
    getNext:   () => next,
    getResult: () => result,
    toObject:  () => {
      return {
        ref,
        title,
        next,
        result
      }
    }
  }
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


module.exports = tree