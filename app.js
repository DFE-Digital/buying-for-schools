const http = require('http')
const port = process.env.PORT || 3000
const nunjucks = require('nunjucks')
const path = require('path')
nunjucks.configure([
  path.resolve(__dirname, './app/templates'),
  path.resolve(__dirname, './node_modules/govuk-frontend/'),
  path.resolve(__dirname, './node_modules/govuk-frontend/components/')
], {
  autoescape: true
})
const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.end(nunjucks.render('buying-for-schools.njk'))
})
server.listen(port, () => {
  console.log(`Server running at port ` + port)
})
