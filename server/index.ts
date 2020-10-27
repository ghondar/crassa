// Set up babel to do its thing... env for the latest toys, react-app for CRA
import base from '@babel/register'

base({
  ignore : [ /\/(build|node_modules)\/(?!@crassa\b)/ ],
  presets: [ '@babel/env', '@babel/preset-react' ],
  plugins: [
    [ '@babel/plugin-proposal-class-properties', { loose: true } ],
    '@babel/plugin-transform-flow-strip-types',
    'babel-plugin-dynamic-import-node', '@loadable/babel-plugin',
    [
      'transform-assets',
      {
        extensions: [
          'css',
          'svg',
          'png',
          'jpg'
        ],
        name: 'static/media/[name].[hash:8].[ext]'
      }
    ]
  ]
})

require('regenerator-runtime/runtime')

const { appRootPath, appPackage, appDotEnv } = require('../src/paths')
const { _moduleAliases } = require(appPackage)

const aliases: {
  [propName: string]: any;
} = {}

Object.keys(_moduleAliases).forEach(key => {
  aliases[key] = _moduleAliases[key].replace('.', appRootPath)
})

const moduleAlias = require('module-alias')

moduleAlias.addAliases(aliases)

require('dotenv').config({
  path: appDotEnv
})
// Now that the nonsense is over... load up the server entry point
require('./server')

// export {}