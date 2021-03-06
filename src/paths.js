const path = require('path')
const { isTs } = require('./util')

const appRootPath = process.env.APP_ROOT || process.cwd()
const crassaRoot = process.env.APP_IT_ROOT || path.dirname(require.main.filename)

function generatePath(name) {
  return (isTs && process.env.NODE_ENV === 'production' ? 'lib/ssr/' : '') + name
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
