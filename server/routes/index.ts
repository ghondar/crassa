// Any route that comes in, send it to the universalLoader

import express from 'express'
import { createStore, universalLoader } from '../universal'
import { existsSync } from 'fs'
import { appServer } from '../../src/paths'

const router = express.Router()

const preLoadState = appServer + '/preLoadState.js'
const hasPreLoadState = existsSync(preLoadState)
const middleware =
  function(req: { baseUrl: string | string[] }, res: any, next: () => void) {
    if(hasPreLoadState)
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
