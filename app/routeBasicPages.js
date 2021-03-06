const nunjucks = require('nunjucks')

const routeBasicPages = app => pages => {
  pages.forEach(page => {
    app.get(page.path, (req, res) => {
      const render = nunjucks.render(page.tpl, {
        locals: app.locals,
        pageTitle: page.title
      })
      res.send(render)
    })
  })
}

module.exports = routeBasicPages