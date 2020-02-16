
const paths = require('react-scripts/config/paths')
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath')
const { appRootPath, appPublic, appBuild, appPackage, appSrc, appDotEnv, appNodeModules } = require('./src/paths')
const { existsSync } = require('fs')

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx'
]

const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(appPackage).homepage,
  process.env.PUBLIC_URL
)

const resolveModule = (filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    existsSync(`${filePath}.${extension}`)
  )

  if(extension)
    return `${filePath}.${extension}`

  return `${filePath}.js`
}

paths.dotenv = existsSync(appDotEnv) ? appDotEnv : paths.dotenv
paths.appPath = appRootPath + '/'
paths.appPublic = appPublic
paths.appHtml = appPublic + '/index.html'
paths.appBuild = appBuild
paths.appPackageJson = appPackage
paths.yarnLockFile = appRootPath + '/yarn.lock'
paths.appSrc = appSrc
paths.appIndexJs = resolveModule(appSrc + '/index')
paths.proxySetup = appSrc + '/setupProxy.js'
paths.testsSetup = appSrc + '/setupTests'
paths.appNodeModules = appNodeModules
paths.publicUrlOrPath = publicUrlOrPath

module.exports = paths
