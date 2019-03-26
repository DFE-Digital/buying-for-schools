module.exports = (label) => {
  switch (label.toLowerCase()) {
    case 'heading': {
      return 'h1'
    }

    case 'submit': {
      return '[type=submit]'
    }

    case 'recommendation': {
      return 'h1 + p.govuk-body-l'
    }
  }
}