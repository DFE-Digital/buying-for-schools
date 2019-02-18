const { fromJS } = require('immutable')

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

module.exports = {
  makeTree,
  getBranch,
  getOption,
  getOptionKey,
  getSelectedOption,
  setSelectedOption
}
