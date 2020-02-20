import { existsSync } from 'fs'
import Fastify from 'fastify'
import AutoLoad from 'fastify-autoload'
import path from 'path'

// import index from './routes/index'

import { appServer, appBuild } from '../src/paths'

// Create our express app (using the port optionally specified)
const fastify = Fastify({
  logger: true
})
const PORT = process.env.REACT_APP_PORT_SERVER || process.env.PORT || 5000
const HOST = process.env.REACT_APP_HOST_SERVER || '0.0.0.0'

const configExpress = appServer + '/configExpress.js'
const hasConfigExpress = existsSync(configExpress)

// Compress, parse, and log
fastify.register(require('fastify-cookie'))
fastify.register(require('fastify-compress'))
fastify.register(require('fastify-formbody'))
// fastify.register(require('fastify-hide-powered-by'))
const http = hasConfigExpress ? require(configExpress).default(fastify) : fastify

// fastify.use('^/$', index)
fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'routes')
})

// fastify.use('/api', require(path.resolve(appServer)).default)
fastify.register(AutoLoad, {
  dir    : path.resolve(appServer),
  options: {
    prefix: '/api/'
  }
})
// Set up route handling, include static assets and an optional API
// fastify.use(express.static(path.resolve(appBuild)))
fastify.register(require('fastify-static'), {
  root  : path.resolve(appBuild),
  prefix: '/public/'
})
// // any other route should be handled by react-router, so serve the index page
// // fastify.use('*', index)
// fastify.register(AutoLoad, {
//   dir    : path.join(__dirname, 'routes'),
//   options: {
//     prefix: '*'
//   }
// })

// Let's rock
http.listen(PORT, HOST, (err, address) => {
  if(err) throw err
  console.log(`App listening on port ${address} ${PORT}!`)
})

// // Handle the bugs somehow
// http.on('error', error => {
//   if(error.syscall !== 'listen') throw error

//   const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT

//   switch (error.code) {
//     case 'EACCES':
//       console.error(bind + ' requires elevated privileges')
//       process.exit(1)
//       break
//     case 'EADDRINUSE':
//       console.error(bind + ' is already in use')
//       process.exit(1)
//       break
//     default:
//       throw error
//   }
// })
