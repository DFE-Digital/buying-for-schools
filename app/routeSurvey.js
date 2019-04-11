const shortid = require('shortid')

const survey = app => {
  app.get('*', (req, res, next) => {
   
    if ( !req.cookies.uid && process.env.SURVEY === 'YES') {
      const uid =shortid.generate()        
      const proto = req.connection.encrypted ? 'https' : 'http'
      const service_url = proto + '://' + req.headers.host + req.url
      res.cookie('uid', uid, { httpOnly: true })
      return res.redirect(302, `https://paperstudio.typeform.com/to/fL7D4D?uid=${uid}&service_url=${service_url}`)  
    }
    
    next()
  })
}

module.exports = survey