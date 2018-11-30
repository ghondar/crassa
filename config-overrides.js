const { override, disableEsLint, addBabelPlugins, addWebpackAlias } = require('customize-cra')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin')
const { appRootPath, appConfigOverrides, appPublic, appPackage } = require('./src/paths')
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
    if(process.env.NODE_ENV === 'production') {
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
    }

    return config
  },
  hasCustomConfigOverrides && require(appConfigOverrides)
)
