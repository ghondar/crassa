// Add alias modules
const moduleAlias = require('module-alias')

// Ignore those pesky styles
require('ignore-styles')

// Set up babel to do its thing... env for the latest toys, react-app for CRA
require('@babel/register')({
  ignore : [ /\/(build|node_modules)\/(?!crassa\b)/ ],
  presets: [ '@babel/env', '@babel/preset-react' ],
  plugins: [ [ '@babel/plugin-proposal-class-properties', { loose: true } ], 'babel-plugin-dynamic-import-node', '@loadable/babel-plugin' ]
})

require('@babel/polyfill')

const { appRootPath, appPackage, appDotEnv } = require('../src/paths')
const { _moduleAliases } = require(appPackage)

const aliases = {}

Object.keys(_moduleAliases).forEach(key => {
  aliases[key] = _moduleAliases[key].replace('.', appRootPath)
})

moduleAlias.addAliases(aliases)

require('dotenv').config({
  path: appDotEnv
})
// Now that the nonsense is over... load up the server entry point
require('./server')
