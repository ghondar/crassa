const { override, addWebpackAlias } = require('customize-cra')

module.exports = override(
  addWebpackAlias({ 'react-dom': '@hot-loader/react-dom' })
)
