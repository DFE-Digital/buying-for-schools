const nunjucks = require('nunjucks')
const marked = require('marked')

const getProviderFull = provider => {
  if (provider.initials === provider.title || !provider.initials.trim()) {
    return provider.title
  }

  return `${provider.title} (${provider.initials})`
}

const getProviderShort = provider => {
  return provider.initials.trim() ? provider.initials : provider.title
}




const dbTreeFramework = app => (req, res) => {
  const { serviceName } = app.locals
  const { urlInfo, summary, frameworkDetails } = res.locals
  const framework = frameworkDetails[0]

  const renderedResult = nunjucks.render('dbTreeFramework.njk', {
    summary,
    locals: app.locals,
    providerFull: getProviderFull(framework.provider),
    providerShort: getProviderShort(framework.provider),
    body: marked(framework.body),
    title: framework.title,
    url: framework.url,
    pageTitle: framework.title
  })
  return res.send(renderedResult)
}

module.exports = dbTreeFramework