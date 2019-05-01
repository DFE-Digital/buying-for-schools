const url = require('url')
const path = require('path')
const nunjucks = require('nunjucks')


const allDealsPage = app => (req, res) => {
  const frameworks = app.locals.frameworks.getAll()
  const grouped = {}
  frameworks.forEach(framework => {
    const cat = framework.getCategory()
    const group = grouped[cat]
    const category = app.locals.categories.find(category => category.ref === cat)
    if (!group) {
      grouped[cat] = {
        ...category, items: []
      }
    }
    grouped[cat].items.push(framework.toObject())
  })

  const renderedResult = nunjucks.render('deals.njk', {
    locals: app.locals,
    grouped,
    pageTitle: 'Framework list',

  })
  return res.send(renderedResult)
}

const dealPage = (app, framework) => (req, res) => {
  const ref = framework.getRef()
  const tpl = `frameworks/${ref}.njk`
  const renderedResult = nunjucks.render(tpl, {
    result : ref,
    resultMeta: framework.toObject(),
    locals: app.locals,
    pageTitle: framework.getTitle()
  })
  return res.send(renderedResult)
}

const routeDealsPage = app => {
  app.get('/framework', allDealsPage(app))

  const frameworks = app.locals.frameworks.getAll()
  frameworks.forEach(f => {
    app.get(path.join('/framework', f.getRef()), dealPage(app, f))
  })

}

module.exports = routeDealsPage