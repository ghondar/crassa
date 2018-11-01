// Any route that comes in, send it to the universalLoader

import express from 'express'
import { createStore, universalLoader } from '../universal'
import { existsSync } from 'fs'
import { appRootPath } from '../../src/paths'

const router = express.Router()

const customFile = appRootPath + '/server/preLoadState.js'
const hasPreLoadState = existsSync(customFile)
const middleware = hasPreLoadState ?
  require(customFile).default :
  function(req, res, next) {
    next()
  }

// Set universal render middlewares
router.get('/', createStore, middleware, universalLoader)

export default router
