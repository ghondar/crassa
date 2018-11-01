const {
  override,
  disableEsLint,
  addBabelPlugin,
  addWebpackAlias
} = require('customize-cra')
const { existsSync } = require('fs')
const { appRootPath } = require('./src/paths')
const { _moduleAliases } = require(appRootPath + '/package.json')
const customFile = appRootPath + '/config-overrides.js'
const hasCustomConfig = existsSync(customFile)

const aliases = {}

Object.keys(_moduleAliases).forEach(key => {
  aliases[key] = _moduleAliases[key].replace('.', appRootPath)
})

module.exports = override(
  disableEsLint(),
  addBabelPlugin('transform-imports'),
  addBabelPlugin('loadable-components/babel'),
  addBabelPlugin('transform-react-remove-prop-types'),
  addWebpackAlias({ ...aliases, 'lodash-es': 'lodash' }),
  hasCustomConfig ? require(customFile) : function(config) {return config}
)
