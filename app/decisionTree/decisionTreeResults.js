const { fromJS } = require('immutable')

const makeFrameworks = frameworkJson => {
  return fromJS(frameworkJson)
}

const getFramework = (frameworks, ref) => {
  return frameworks.find(framework => {
    return framework.get('ref') === ref
  })
}

module.exports = {
  makeFrameworks,
  getFramework
}
