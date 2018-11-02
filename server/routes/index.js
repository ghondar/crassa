// Any route that comes in, send it to the universalLoader

import express from 'express'
import { createStore, universalLoader } from '../universal'
import { existsSync } from 'fs'
import { appServer } from '../../src/paths'

const router = express.Router()

const preLoadState = appServer + '/preLoadState.js'
const hasPreLoadState = existsSync(preLoadState)
const middleware = hasPreLoadState ?
  require(preLoadState).default :
  function(req, res, next) {
    next()
  }

// Set universal render middlewares
router.get('/', createStore, middleware, universalLoader)

export default router
