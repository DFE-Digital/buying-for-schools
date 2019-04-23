const treeUtils = require('./treeUtils')

const tree = (data) => {
  const branches = data.map(branchdata => makeBranch(branchdata))
  const tree = {
    getFirst: () => branches[0],
    getBranches: () => branches,
    getBranch: (branchRef) => branches.find(branch => branch.getRef() === branchRef)
  }
  const allPaths = treeUtils.getAllBranchPaths(tree)
  tree.getAllPaths = () => allPaths
  return tree
}

const makeBranch = (data) => {
  const { ref, title, err, hint, suffix } = data
  const options = data.options.map(optiondata => makeOption(optiondata))
  return {
    getRef: () => ref,
    getTitle: () => title,
    getErr: () => err,
    getHint: () => hint,
    getSuffix: () => suffix,
    getOptions: () => options,
    getOption: (optionRef) => options.find(option => option.getRef() === optionRef),
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
  const { ref, title, next, result, hint } = data
  return {
    getRef: () => ref,
    getTitle: () => title,
    getNext: () => next,
    getResult: () => result,
    getHint: () => hint,
    toObject: () => {
      return {
        ref,
        title,
        next,
        result
      }
    }
  }
}

module.exports = tree




// const deepFreeze = (obj) => {
//   const propNames = Object.getOwnPropertyNames(obj)
//   for (let name of propNames) {
//     const value = obj[name]
//     obj[name] = (value && typeof value === "object") ? deepFreeze(value) : value
//   }
//   return Object.freeze(obj)
// }
