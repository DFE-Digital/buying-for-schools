const routeIntroPages = app => {
  const introPages = [
    { 
      path: '/',
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

  return introPages
}

module.exports = routeIntroPages