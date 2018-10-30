const moduleAlias = require("module-alias");

const { packageRootPath } = require("./src/paths");
const { _moduleAliases } = require(packageRootPath + "/package.json");

const aliases = {};

Object.keys(_moduleAliases).forEach(key => {
  aliases[key] = _moduleAliases[key].replace(".", packageRootPath);
});

moduleAlias.addAliases(aliases);

require("react-app-rewired/scripts/build");
