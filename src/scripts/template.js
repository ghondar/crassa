const { join, resolve } = require('path')
const { promises } = require('fs')
const { /* execCmd, */ folderExists, log, colorize, replaceAll, capitalize } = require('../util')

const { /*  appRootPath, packageRootPath, */ appSrc } = require('../paths')

async function createFolder(name) {
  const path = join(appSrc, 'reducers', name)

  if(!(await folderExists(path))) {
    log({ text: colorize('generate reducer folder').FgGreen(), type: 'info' })
    await promises.mkdir(path)
  }
}

async function createFile(name, path, file) {
  const template = await promises.readFile(resolve(__dirname, '../templates', path , file))

  let parsedTemplate = replaceAll(template.toString(), '{-- name --}', name)
  parsedTemplate = replaceAll(parsedTemplate.toString(), '{-- upperName --}', name.toUpperCase())
  parsedTemplate = replaceAll(parsedTemplate.toString(), '{-- capitalizeName --}', capitalize(name))

  await promises.writeFile(join(appSrc, 'reducers', name, 'index.js'), parsedTemplate)
}

async function generateReducer() {
  const argv = process.argv
  const args = argv.slice(3, argv.length)
  await createFolder(args[0])
  await createFile(args[0], 'reducers', 'index.js')

  log({ text: colorize('generate reducer files').FgGreen(), type: 'info' })
}

const templateCommands = [
  {
    name       : 'generate',
    fn         : generateReducer,
    description: 'Generate a reducer witn a name.'
  }
]

module.exports = {
  templateCommands
}
