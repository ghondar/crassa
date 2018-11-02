const { override, disableEsLint, addBabelPlugin, addWebpackAlias } = require('customize-cra')
const { appRootPath, appConfigOverrides, appPackage } = require('./src/paths')
const { existsSync } = require('fs')
const { _moduleAliases } = require(appPackage)

const hasCustomConfigOverrides = existsSync(appConfigOverrides)

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
  hasCustomConfigOverrides ?
    require(appConfigOverrides) :
    function(config) {
      return config
    }
)
