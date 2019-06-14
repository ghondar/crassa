import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { existsSync } from 'fs'
import express from 'express'
import morgan from 'morgan'
import path from 'path'

import index from './routes/index'

import { appServer, appBuild } from '../src/paths'

// Create our express app (using the port optionally specified)
const app = express()
const PORT = process.env.REACT_APP_PORT_SERVER || process.env.PORT || 5000

const configExpress = appServer + '/configExpress.js'
const hasConfigExpress = existsSync(configExpress)

// Compress, parse, and log
app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.disable('x-powered-by')
const http = hasConfigExpress ? require(configExpress).default(app) : app

app.use('^/$', index)
app.use('/api', require(path.resolve(appServer)).default)
// Set up route handling, include static assets and an optional API
app.use(express.static(path.resolve(appBuild)))
// any other route should be handled by react-router, so serve the index page
app.use('*', index)

// Let's rock
http.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
})

// Handle the bugs somehow
http.on('error', error => {
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
