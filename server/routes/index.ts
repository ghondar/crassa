// Any route that comes in, send it to the universalLoader

import express from 'express'
import { createStore, universalLoader } from '../universal'
import { appServer } from '../../src/paths'
import { resolveModule } from '../../src/util'

const router = express.Router()

const preLoadState = resolveModule(appServer + '/preLoadState')
const middleware =
  function(req: { baseUrl: string | string[] }, res: any, next: () => void) {
    if(preLoadState)
      if(req.baseUrl.indexOf('.') !== -1 || req.baseUrl.indexOf('api') !== -1 || req.baseUrl.indexOf('static') !== -1) {
        next()
      } else {
        require(preLoadState).default(req, res, next)
      }
    else
      next()
  }

// Set universal render middlewares
router.use(createStore, middleware, universalLoader)

export default router
