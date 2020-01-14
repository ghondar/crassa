const path = require('path')

const crassaRoot = process.env.APP_IT_ROOT || path.dirname(require.main.filename)

export const packageRootPath = crassaRoot
export const appRootPath = process.env.APP_ROOT || process.cwd()

export const appServer          = path.join(appRootPath, 'server')
export const appPackage         = path.join(appRootPath, 'package.json')
export const appBuild           = path.join(appRootPath, 'build')
export const appSrc             = path.join(appRootPath, 'src')
export const appPublic          = path.join(appRootPath, 'public')
export const appConfigOverrides = path.join(appRootPath, 'config-overrides.js')
export const appDotEnv          = path.join(appRootPath, '.env')
export const appNodeModules     = path.join(appRootPath, 'node_modules')
