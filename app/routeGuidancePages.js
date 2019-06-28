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
      tpl: 'manual/books.njk'
    },
    { 
      path: '/guidance/ict-hardware',
      title: 'Buy ICT hardware for your school',
      tpl: 'manual/ict-hardware.njk'
    },
    { 
      path: '/guidance/catering',
      title: 'Buy catering services for your school',
      tpl: 'manual/catering.njk'
    },
    { 
      path: '/guidance/exams',
      title: 'Save money on your exams budget',
      tpl: 'manual/exams.njk'
    }
    
  ]

  return introPages
}

module.exports = routeGuidancePages

/*
Start page: https://www.gov.uk/guidance/find-a-dfe-approved-framework-for-your-school
manual homepage for category led content: https://www.gov.uk/guidance/buying-for-schools
Cleaning: https://www.gov.uk/guidance/buying-for-schools/cleaning-services
Catering: https://www.gov.uk/guidance/buying-for-schools/catering-services
electricity: https://www.gov.uk/guidance/buying-for-schools/electricity
Books and educational resources: https://www.gov.uk/guidance/buying-for-schools/books-and-educational-resources
ICT and computer hardware: https://www.gov.uk/guidance/buying-for-schools/ict-and-computer-hardware
*/