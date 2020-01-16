const path = require('path')

const appRootPath = process.env.APP_ROOT || process.cwd()
const crassaRoot = process.env.APP_IT_ROOT || path.dirname(require.main.filename)

module.exports = {
  packageRootPath   : crassaRoot,
  appRootPath,
  appServer         : path.join(appRootPath, 'server'),
  appPackage        : path.join(appRootPath, 'package.json'),
  appBuild          : path.join(appRootPath, 'build'),
  appLib            : path.join(appRootPath, 'lib'),
  appSrc            : path.join(appRootPath, 'src'),
  appPublic         : path.join(appRootPath, 'public'),
  appConfigOverrides: path.join(appRootPath, 'config-overrides.js'),
  appDotEnv         : path.join(appRootPath, '.env'),
  appNodeModules    : path.join(appRootPath, 'node_modules')
}
