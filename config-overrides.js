const { override, disableEsLint, addBabelPlugins, addWebpackAlias } = require('customize-cra')
const LoadablePlugin = require('@loadable/webpack-plugin')
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
  ...addBabelPlugins('transform-imports', '@loadable/babel-plugin', 'transform-react-remove-prop-types'),
  addWebpackAlias({ ...aliases, 'lodash-es': 'lodash' }),
  function(config) {
    config.plugins.push(new LoadablePlugin())

    return config
  },
  hasCustomConfigOverrides ?
    require(appConfigOverrides) :
    function(config) {
      return config
    }
)
