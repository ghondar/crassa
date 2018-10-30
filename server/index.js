// Add alias modules
require('module-alias/register')
// Ignore those pesky styles
require('ignore-styles')

// Set up babel to do its thing... env for the latest toys, react-app for CRA
require('@babel/register')({
  ignore : [ /\/(build|node_modules)\// ],
  presets: [ '@babel/env', '@babel/preset-react' ],
  plugins: [
    [ '@babel/plugin-proposal-class-properties', { loose: true } ],
    [ '@babel/plugin-proposal-decorators', { legacy: true } ],
    'loadable-components/babel',
    'babel-plugin-dynamic-import-node-babel-7'
  ]
})

require('@babel/polyfill')

// Now that the nonsense is over... load up the server entry point
require('./server')
