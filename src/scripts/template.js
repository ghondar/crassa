const { join, resolve } = require('path')
const { promises } = require('fs')
const { /* execCmd, */ folderExists, log, colorize, replaceAll, capitalize } = require('../util')

const { /*  appRootPath, packageRootPath, */ appSrc } = require('../paths')

const regexImport = /(import*) ([^']*) from '.\/([^']*)'/g
const regexReducer = /\[([^']*)\]:([^\n]*)/g
const regexSagas = /\.\.\.([^']*)\.([^\n]*)/g

async function createFolder(name) {
  const path = join(appSrc, 'reducers', name)

  if(!(await folderExists(path))) {
    log({ text: colorize(`generate ${name} reducer folder`).FgGreen(), type: 'info' })
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

async function readReducerFile(name) {
  const indexFilePath = resolve(appSrc, 'reducers', 'index.js')
  const file = (await promises.readFile(indexFilePath)).toString()
  const [ firstImport ] = file.match(regexImport)
  const [ lastReducer ] = file.match(regexReducer)
  const [ lastSagas ] = file.match(regexSagas)

  let parsedFile = file.replace(firstImport, `${firstImport}\nimport ${name} from './${name}'`)
  parsedFile = parsedFile.replace(lastReducer, `${lastReducer},\n\t[${name}.store]: ${name}.reducer`)
  parsedFile = parsedFile.replace(lastSagas, `${lastSagas},\n\t...${name}.takes`)

  await promises.writeFile(indexFilePath, parsedFile)
}

async function generateReducer() {
  const argv = process.argv
  const [ name ] = argv.slice(3, argv.length)

  await createFolder(name)
  await createFile(name, 'reducers', 'index.js')
  await readReducerFile(name)

  log({ text: colorize(`generate ${name} reducer files`).FgGreen(), type: 'info' })
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
