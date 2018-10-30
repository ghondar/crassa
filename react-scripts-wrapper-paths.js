const paths = require('react-scripts/config/paths')
const { appRootPath } = require('./src/paths')
const { existsSync } = require('fs')
let { replaceRootPath } = require('./src/replace')

replaceRootPath = replaceRootPath.bind({ appRootPath })

const { homepage } = require(replaceRootPath('package.json'))

const dotenv = replaceRootPath('.env')

paths.dotenv = existsSync(dotenv) ? dotenv : paths.dotenv
paths.appPath = replaceRootPath()
paths.appPublic = replaceRootPath('public')
paths.appHtml = replaceRootPath('public/index.html')
paths.appBuild = replaceRootPath('build')
paths.appPackageJson = replaceRootPath('package.json')
paths.yarnLockFile = replaceRootPath('yarn.lock')
paths.appSrc = replaceRootPath('src')
paths.appIndexJs = replaceRootPath('src/index.js')
paths.proxySetup = replaceRootPath('src/setupProxy.js')
paths.testsSetup = replaceRootPath('src/setupTests')
paths.appNodeModules = replaceRootPath('node_modules')
paths.servedPath = '/'
paths.publicUrl = homepage || ''

module.exports = paths
