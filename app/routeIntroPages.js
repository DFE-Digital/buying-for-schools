const nunjucks = require('nunjucks')

const routeIntroPages = app => {
  const introPages = [
    { 
      path: '/',
      title: app.locals.serviceName,
      tpl: 'start-page.njk'
    },
    { 
      path: '/benefits',
      title: 'Benefits of using a framework',
      tpl: 'framework-benefits.njk'
    },
    { 
      path: '/selection',
      title: 'How frameworks are selected',
      tpl: 'framework-selection.njk'
    },
    { 
      path: '/service-output',
      title: 'After you’ve used the service',
      tpl: 'service-output.njk'
    }
  ]

  introPages.forEach(page => {
    app.get(page.path, (req, res) => {
      const render = nunjucks.render(page.tpl, {
        serviceName: app.locals.serviceName,
        pageTitle: page.title
      })
      res.send(render)
    })
  })
}

module.exports = routeIntroPages