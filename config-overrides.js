const { override, disableEsLint, addBabelPlugins, addWebpackAlias } = require('customize-cra')
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
  ...addBabelPlugins('transform-imports', 'loadable-components/babel', 'transform-react-remove-prop-types'),
  addWebpackAlias({ ...aliases, 'lodash-es': 'lodash' }),
  hasCustomConfigOverrides && require(appConfigOverrides)
)
