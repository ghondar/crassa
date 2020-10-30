const path = require('path')
const { resolveModule } = require('./util')

const appRootPath = process.env.APP_ROOT || process.cwd()
const crassaRoot = process.env.APP_IT_ROOT || path.dirname(require.main.filename)

let packageJson = null
const packagePath = resolveModule(appRootPath + '/package')

if(packagePath)
  packageJson = require(packagePath)

function generatePath(name) {
  return (
    packageJson &&
      packageJson.crassa &&
      packageJson.crassa.platform == 'ts' &&
      process.env.NODE_ENV === 'production' ? 'lib/ssr/' : ''
  ) + name
}

const appServer = path.join(appRootPath,  generatePath('server'))
const appSrc = path.join(appRootPath,  generatePath('src'))

module.exports = {
  packageRootPath   : crassaRoot,
  appRootPath,
  appServer,
  appPackage        : path.join(appRootPath, 'package.json'),
  appBuild          : path.join(appRootPath, 'build'),
  appSrc,
  appPublic         : path.join(appRootPath, 'public'),
  appConfigOverrides: path.join(appRootPath, 'config-overrides.js'),
  appDotEnv         : path.join(appRootPath, '.env'),
  appNodeModules    : path.join(appRootPath, 'node_modules')
}
