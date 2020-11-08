const { join, resolve } = require('path')

const pluralize = require('pluralize')
const inquirerRecursive = require('inquirer-recursive')

const { capitalize, isTs } = require('../util')

const { appSrc } = require('../paths')

const regexImport = /import [\w\-\/\_]+ from ([\"\']){1}[\w\-\/\_\.]+\1\n(?=[^\/]*$)/gm
const regexReducer = /(\[([^,]*)\]([^\n]*reducer))\n/g
const regexSagas = /(\.\.\.([^,]*)\.([^\n]*takes))\n/g

const generatePathTemplate = (path, file) => {
  return resolve(__dirname, '../templates', path, file)
}
const generatePathFile = (name, folder, file) => {
  return join(appSrc, folder, name, file)
}
const generateSpaces = (size) => {
  return new Array(size + 1).fill('').join(' ')
}

module.exports = function(plop) {
  plop.setPrompt('recursive', inquirerRecursive)

  plop.setHelper('pluralizeSnakeCase', function(text) {
    return pluralize(text.toLowerCase())
  })
  plop.setHelper('upper', function(text) {
    return text.toUpperCase()
  })
  plop.setHelper('capitalize', function(text) {
    return capitalize(text)
  })

  plop.setGenerator('Reducer', {
    prompts: [
      {
        name   : 'name',
        type   : 'input',
        message: 'name of your Reducer?'
      },
      {
        type     : 'confirm',
        name     : 'isSagas',
        message  : 'Do you want sagas?',
        'default': true
      }
    ],
    actions: ({ name, isSagas }) => {
      let actions = [ {
        type        : 'add',
        path        : generatePathFile(name, 'reducers', `index${isTs ? '.ts' : '.js'}`),
        templateFile: generatePathTemplate('reducers', `index${isTs ? '.ts' : ''}.hbs`)
      },
      {
        type    : 'modify',
        path    : join(appSrc, 'reducers', `index${isTs ? '.ts' : '.js'}`),
        pattern : regexImport,
        template: `$&import ${name} from './${name}'\n`
      },
      {
        type    : 'modify',
        path    : join(appSrc, 'reducers', `index${isTs ? '.ts' : '.js'}`),
        pattern : regexReducer,
        template: `$1,\n${generateSpaces(2)}[${name}.store]: ${name}.reducer\n`
      } ]

      if(isSagas)
        actions.push(...[
          {
            type        : 'add',
            path        : generatePathFile(name, 'reducers', `sagas${isTs ? '.ts' : '.js'}`),
            templateFile: generatePathTemplate('reducers', `sagas${isTs ? '.ts' : ''}.hbs`)
          },
          {
            type        : 'add',
            path        : generatePathFile(name, 'reducers', `takes${isTs ? '.ts' : '.js'}`),
            templateFile: generatePathTemplate('reducers', `takes${isTs ? '.ts' : ''}.hbs`)
          },
          {
            type    : 'modify',
            path    : join(appSrc, 'reducers', `index${isTs ? '.ts' : '.js'}`),
            pattern : regexSagas,
            template: `$1,\n${generateSpaces(4)}...${name}.takes\n`
          }
        ])

      return actions
    }
  })
}
