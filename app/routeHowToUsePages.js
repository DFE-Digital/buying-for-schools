const routeHowToUsePages = app => {
  const howToUsePages = [
    { 
      path: '/how-to-use-ypo-framework',
      title: 'How to use the YPO framework',
      tpl: 'how-to-use/ypo-electricity.njk'
    },
    { 
      path: '/how-to-use-espo-framework',
      title: 'How to use the ESPO framework',
      tpl: 'how-to-use/espo.njk'
    }
  ]

  return howToUsePages
}

module.exports = routeHowToUsePages