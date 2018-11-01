const path = require('path')

const appRootPath = process.env.APP_ROOT || process.cwd()
const crassaRoot = process.env.APP_IT_ROOT || path.dirname(require.main.filename)

module.exports = {
  packageRootPath: crassaRoot,
  appRootPath,
  appServer      : path.join(appRootPath, 'src/server')
}
