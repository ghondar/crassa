// Any route that comes in, send it to the universalLoader

import express, { RequestHandler } from 'express'
import { createStore, universalLoader } from '../universal'
import { appServer } from '../../src/paths'
import { resolveModule } from '../../src/util'
import { isReservedPath } from '../helpers/is-reserved-path.helper'

const router = express.Router()

const preLoadState = resolveModule(appServer + '/preLoadState')
const middleware: RequestHandler = function(req, res, next) {
  if(preLoadState)
    if(isReservedPath(req.baseUrl))
      next()
    else
      require(preLoadState).default(req, res, next)
  else
    next()
}

// Set universal render middlewares
router.use(createStore, middleware, universalLoader)

export default router
