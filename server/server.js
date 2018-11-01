import bodyParser from 'body-parser'
import compression from 'compression'
import express from 'express'
import morgan from 'morgan'
import path from 'path'

import index from './routes/index'

import { appRootPath } from '../src/paths'

// Create our express app (using the port optionally specified)
const app = express()
const PORT = process.env.PORT || 5000

// Compress, parse, and log
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.disable('x-powered-by')

// Set up route handling, include static assets and an optional API
app.use('/', index)
app.use(express.static(path.resolve(appRootPath + '/build')))
app.use('/api', require(path.resolve(appRootPath + '/server')).default)

// Let's rock
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
})

// Handle the bugs somehow
app.on('error', error => {
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
