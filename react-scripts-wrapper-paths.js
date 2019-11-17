const paths = require('react-scripts/config/paths')
const { appRootPath, appPublic, appBuild, appPackage, appSrc, appDotEnv, appNodeModules } = require('./src/paths')
const { existsSync } = require('fs')
const url = require('url')

const { homepage } = require(appPackage)

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/')
  if(hasSlash && !needsSlash) return inputPath.substr(0, inputPath.length - 1)
  else if(!hasSlash && needsSlash) return `${inputPath}/`
  else return inputPath
}

function getServedPath(publicUrl) {
  const servedUrl = publicUrl ? url.parse(publicUrl).pathname : '/'

  return ensureSlash(servedUrl, true)
}

paths.dotenv = existsSync(appDotEnv) ? appDotEnv : paths.dotenv
paths.appPath = appRootPath + '/'
paths.appPublic = appPublic
paths.appHtml = appPublic + '/index.html'
paths.appBuild = appBuild
paths.appPackageJson = appPackage
paths.yarnLockFile = appRootPath + '/yarn.lock'
paths.appSrc = appSrc
paths.appIndexJs = appSrc + '/index.tsx'
paths.proxySetup = appSrc + '/setupProxy.js'
paths.testsSetup = appSrc + '/setupTests'
paths.appNodeModules = appNodeModules
paths.servedPath = homepage ? getServedPath(homepage) : '/'
paths.publicUrl = homepage || ''

module.exports = paths
