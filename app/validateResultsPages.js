const path = require('path')
const fs = require('fs')
const url = require('url')

const validateResultsPages = app => {
  const { allPaths, tree, frameworks } = app.locals

  const errors = []
  allPaths.results.forEach(res => {
    const urlBits = res.split('/')
    const ref = urlBits[urlBits.length -1]
    const meta = frameworks.find(f => f.get('ref') === ref)
    if (!meta) {
      errors.push({ msg: `Missing framework ${ref} in frameworks.json` })
    }
    if (!fs.existsSync(`./templates/frameworks/${ref}.njk`)) {
      errors.push({ msg: `Missing template ${ref} in templates/frameworks` }) 
    }
  })
  return errors
}
 
module.exports = validateResultsPages