import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { existsSync } from 'fs'
import express from 'express'
import morgan from 'morgan'
import path from 'path'

import { appServer, appBuild } from '../src/paths'
import { resolveModule } from '../src/util'

// Create our express app (using the port optionally specified)
const app: express.Application = express()
const PORT = process.env.REACT_APP_PORT_SERVER || process.env.PORT || 5000
const HOST = process.env.REACT_APP_HOST_SERVER || '0.0.0.0'

const configExpress = resolveModule(appServer + '/configExpress')

let index
if(process.env.NODE_ENV === 'production')
  index = require('./routes/index').default

// Compress, parse, and log
app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json(process.env.BODY_PARSER_LIMIT ? { limit: process.env.BODY_PARSER_LIMIT } : {}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.disable('x-powered-by')
const http = configExpress ? require(configExpress).default(app) : app

if(index)
  app.use('^/$', index)

app.use('/api', require(path.resolve(appServer)).default)
// Set up route handling, include static assets and an optional API
app.use(express.static(path.resolve(appBuild)))
// any other route should be handled by react-router, so serve the index page
if(index)
  app.use('*', index)

// Let's rock
http.listen(PORT, HOST, () => {
  console.log(`App listening on port ${PORT}!`)
})

// Handle the bugs somehow
http.on('error', (error: any) => {
  if(error.syscall !== 'listen') throw error

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
})
