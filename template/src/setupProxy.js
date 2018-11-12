const proxy = require('http-proxy-middleware')
const { existsSync } = require('fs')

const { appSrc } = require('./src/paths')

const setupProxy = appSrc + '/setupProxy.js'
const hasCustomProxies = existsSync(setupProxy)

module.exports = function(app) {
  app.use(proxy('/api', { target: 'http://localhost:5000/' }))
  if(hasCustomProxies) requires(setupProxy)(app)
}
