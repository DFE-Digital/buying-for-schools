const routeGuidancePages = app => {
  const introPages = [
    { 
      path: '/guidance',
      title: 'Buying for schools: category guidance',
      tpl: 'manual/collection.njk'
    },
    { 
      path: '/guidance/electricity',
      title: 'Buy electricity for your school',
      tpl: 'manual/electricity.njk'
    },
    { 
      path: '/guidance/cleaning',
      title: 'Buy cleaning services for your school',
      tpl: 'manual/cleaning.njk'
    },
    { 
      path: '/guidance/books',
      title: 'Buy books for your school',
      tpl: 'guidance/books.njk'
    },
    { 
      path: '/guidance/ict-hardware',
      title: 'Buy ICT hardware for your school',
      tpl: 'guidance/ict-hardware.njk'
    },
    { 
      path: '/guidance/catering',
      title: 'Buy catering services for your school',
      tpl: 'manual/catering.njk'
    }
    
  ]

  return introPages
}

module.exports = routeGuidancePages