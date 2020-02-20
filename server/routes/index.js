import { createStore, universalLoader } from '../universal'
import { existsSync } from 'fs'
import { appServer } from '../../src/paths'

const preLoadState = appServer + '/preLoadState.js'
const hasPreLoadState = existsSync(preLoadState)

module.exports = function(f, opts, next) {
  f.decorateReply('locals', {
    store   : null,
    history : null,
    htmlData: null
  })

  f.addHook('preHandler', createStore)
  f.addHook('preHandler',  (req, res, done) => {
    if(hasPreLoadState)
      if(req.raw.url.indexOf('.') !== -1 || req.raw.url.indexOf('api') !== -1 || req.raw.url.indexOf('static') !== -1) {
        done()
      } else {
        require(preLoadState).default(req, res, done)
      }
    else
      done()
  })

  f.get('*', (req, res) => universalLoader(req, res, next))

  next()
}
