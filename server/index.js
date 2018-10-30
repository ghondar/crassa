// Add alias modules
const moduleAlias = require("module-alias");

// Ignore those pesky styles
require("ignore-styles");

// Set up babel to do its thing... env for the latest toys, react-app for CRA
require("@babel/register")({
  ignore: [/\/(build|node_modules)\//],
  presets: ["@babel/env", "@babel/preset-react"],
  plugins: [
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    "loadable-components/babel",
    "babel-plugin-dynamic-import-node-babel-7"
  ]
});

require("@babel/polyfill");

const { appRootPath } = require("../src/paths");
const { _moduleAliases } = require(appRootPath + "/package.json");

const aliases = {};

Object.keys(_moduleAliases).forEach(key => {
  aliases[key] = _moduleAliases[key].replace(".", appRootPath);
});

moduleAlias.addAliases(aliases);

// Now that the nonsense is over... load up the server entry point
require("./server");
