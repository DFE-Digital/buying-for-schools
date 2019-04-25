const treeUtils = require('./treeUtils')

const makeTree = (data) => {
  const branches = data.map(branchdata => makeBranch(branchdata))
  Object.freeze(branches)
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
  Object.freeze(options)
  return {
    getRef: () => ref,
    getTitle: () => title,
    getErr: () => err,
    getHint: () => hint,
    getSuffix: () => suffix,
    getOptions: () => options,
    getOption: (optionRef) => options.find(option => option.getRef() === optionRef),
    toObject: () => {
      return {
        ref,
        title,
        err,
        hint,
        suffix,
        options: options.map(opt => opt.toObject())
      }
    }
  }
}

const makeOption = (data) => {
  const { ref, title, next, result, hint } = data
  Object.freeze(result)
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
        result,
        hint
      }
    }
  }
}

module.exports = {
  makeTree,
  makeBranch,
  makeOption
}