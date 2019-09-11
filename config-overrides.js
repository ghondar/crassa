const { override, disableEsLint, addBabelPlugins, addWebpackAlias } = require('customize-cra')
const LoadablePlugin = require('@loadable/webpack-plugin')
const { existsSync } = require('fs')

const { appRootPath, appConfigOverrides, appPackage } = require('./src/paths')
const { _moduleAliases } = require(appPackage)

const hasCustomConfigOverrides = existsSync(appConfigOverrides)

const aliases = {}

Object.keys(_moduleAliases).forEach(key => {
  aliases[key] = _moduleAliases[key].replace('.', appRootPath)
})

const addLoadablePlugin =  config => {
  config.plugins.push(
    new LoadablePlugin()
  )

  config.plugins[0].options.inject = false

  return config
}

module.exports = override(
  process.env.NODE_ENV === 'production' && addLoadablePlugin,
  disableEsLint(),
  ...addBabelPlugins('transform-imports', '@loadable/babel-plugin', 'transform-react-remove-prop-types'),
  addWebpackAlias({ ...aliases, 'lodash-es': 'lodash' }),
  hasCustomConfigOverrides && require(appConfigOverrides)
)