const { override, disableEsLint, addBabelPlugins, addWebpackAlias } = require('customize-cra')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin')
const { existsSync } = require('fs')

const { appRootPath, appConfigOverrides, appPackage } = require('./src/paths')
const { _moduleAliases } = require(appPackage)

const hasCustomConfigOverrides = existsSync(appConfigOverrides)

const aliases = {}

Object.keys(_moduleAliases).forEach(key => {
  aliases[key] = _moduleAliases[key].replace('.', appRootPath)
})

module.exports = override(
  config => {
    config.plugins.push(
      new LoadablePlugin()
    )
    config.plugins.shift()

    config.plugins.unshift(
      new HtmlWebpackPlugin({
        inject  : false,
        template: appPublic + '/index.html',
        minify  : {
          removeComments               : true,
          collapseWhitespace           : true,
          removeRedundantAttributes    : true,
          useShortDoctype              : true,
          removeEmptyAttributes        : true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash             : true,
          minifyJS                     : true,
          minifyCSS                    : true,
          minifyURLs                   : true
        }
      })
    )

    return config
  },
  disableEsLint(),
  ...addBabelPlugins('transform-imports', '@loadable/babel-plugin', 'transform-react-remove-prop-types'),
  addWebpackAlias({ ...aliases, 'lodash-es': 'lodash' }),
  hasCustomConfigOverrides && require(appConfigOverrides)
)
