const { join, resolve } = require('path')
const { promises } = require('fs')
const { /* execCmd, */ folderExists, log, colorize, replaceAll } = require('../util')

const { /*  appRootPath, packageRootPath, */ appSrc } = require('../paths')

async function createFolder(name) {
  const path = join(appSrc, 'reducers', name)

  if(!(await folderExists(path))) {
    log({ text: colorize('create reducer crud').FgGreen(), type: 'info' })
    await promises.mkdir(path)
  }
}

async function createFile(name) {
  const template = await promises.readFile(resolve(__dirname, '../templates/reducers', 'index.js'))
  const file = replaceAll(template.toString(), '{-- name --}', name)

  // Create real package.json
  await promises.writeFile(join(appSrc, 'reducers', name, 'index.js'), file)
}

async function generateReducer() {
  const argv = process.argv
  const args = argv.slice(3, argv.length)
  await createFolder(args[0])
  await createFile(args[0])
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
