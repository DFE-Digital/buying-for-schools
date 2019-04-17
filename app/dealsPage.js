const url = require('url')
const path = require('path')
const nunjucks = require('nunjucks')

const dt = require('./decisionTree/decisionTree')

const allDealsPage = app => (req, res) => {
  const frameworks = app.locals.frameworks.toJS()
  const grouped = {}
  frameworks.forEach(framework => {
    let group = grouped[framework.cat]
    let category = app.locals.categories.find(cat => cat.ref === framework.cat)
    if (!group) {
      grouped[framework.cat] = {
        ...category, items: []
      }
    }
    grouped[framework.cat].items.push(framework)
  })

  const renderedResult = nunjucks.render('deals.njk', {
    locals: app.locals,
    grouped,
    pageTitle: 'Framework list',

  })
  return res.send(renderedResult)
}

const dealPage = (app, framework) => (req, res) => {
  const { ref, title } = framework
  const tpl = `frameworks/${ref}.njk`
  const renderedResult = nunjucks.render(tpl, {
    result : ref,
    framework,
    resultMeta: framework,
    locals: app.locals,
    pageTitle: title
  })
  return res.send(renderedResult)
}

const routeDealsPage = app => {
  app.get('/framework', allDealsPage(app))

  const frameworks = app.locals.frameworks.toJS()
  frameworks.forEach(f => {
    app.get(path.join('/framework', f.ref), dealPage(app, f))
  })

}

module.exports = routeDealsPage