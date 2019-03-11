const { fromJS } = require('immutable')

const makeFrameworks = frameworkJson => {
  return fromJS(frameworkJson)
}

const getFramework = (frameworks, ref) => {
  return frameworks.find(framework => framework.get('ref') === ref)
}

module.exports = {
  makeFrameworks,
  getFramework
}
