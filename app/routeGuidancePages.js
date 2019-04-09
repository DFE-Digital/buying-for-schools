const routeGuidancePages = app => {
  const introPages = [
    { 
      path: '/collection',
      title: 'Buying for schools: category guidance',
      tpl: 'guidance/collection.njk'
    },
    { 
      path: '/guidance/electricity',
      title: 'Buy electricity for your school',
      tpl: 'guidance/electricity.njk'
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
    
  ]

  return introPages
}

module.exports = routeGuidancePages