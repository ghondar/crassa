const paths = require('react-scripts/config/paths')
const { appRootPath, appPublic, appBuild, appPackage, appSrc, appDotEnv, appNodeModules } = require('./src/paths')
const { existsSync } = require('fs')

const { homepage } = require(appPackage)

paths.dotenv = existsSync(appDotEnv) ? appDotEnv : paths.dotenv
paths.appPath = appRootPath + '/'
paths.appPublic = appPublic
paths.appHtml = appPublic + '/index.html'
paths.appBuild = appBuild
paths.appPackageJson = appPackage
paths.yarnLockFile = appRootPath + '/yarn.lock'
paths.appSrc = appSrc
paths.appIndexJs = appSrc + '/index.js'
paths.proxySetup = appSrc + '/setupProxy.js'
paths.testsSetup = appSrc + '/setupTests'
paths.appNodeModules = appNodeModules
paths.servedPath = '/'
paths.publicUrl = homepage || ''

module.exports = paths
