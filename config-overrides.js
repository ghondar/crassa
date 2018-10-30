const {
  override,
  disableEsLint,
  addWebpackAlias,
  addBundleVisualizer
} = require('customize-cra')
const { appRootPath } = require('./src/paths')
const { _moduleAliases } = require(appRootPath + '/package.json')

// const rewireVendorSplitting = require('react-app-rewire-vendor-splitting')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const paths = require('react-app-rewired/scripts/utils/paths')
// const { injectBabelPlugin } = require('react-app-rewired')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const path = require('path')

const aliases = {}

Object.keys(_moduleAliases).forEach(key => {
  aliases[key] = _moduleAliases[key].replace('.', appRootPath)
})

module.exports = override(
  disableEsLint(),
  process.env.BUNDLE_VISUALIZE == 1 && addBundleVisualizer(),
  addWebpackAlias({ ...aliases, 'lodash-es': 'lodash' })
)
