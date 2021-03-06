const { ncp } = require('ncp')

const fs = require('fs')
const { promisify } = require('util')

const fileStats = promisify(fs.stat)

function copyDir({ source, destination }) {
  return new Promise((resolve, reject) => {
    ncp(source, destination, err => {
      if(err) {
        console.error('Error while copying folder contents.', err)
        reject(err)

        return
      }
      resolve()
    })
  })
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function colorize(str) {
  const colorsMods = {
    Reset     : '\x1b[0m',
    Bright    : '\x1b[1m',
    Dim       : '\x1b[2m',
    Underscore: '\x1b[4m',
    Blink     : '\x1b[5m',
    Reverse   : '\x1b[7m',
    Hidden    : '\x1b[8m',

    FgBlack  : '\x1b[30m',
    FgRed    : '\x1b[31m',
    FgGreen  : '\x1b[32m',
    FgYellow : '\x1b[33m',
    FgBlue   : '\x1b[34m',
    FgMagenta: '\x1b[35m',
    FgCyan   : '\x1b[36m',
    FgWhite  : '\x1b[37m',

    BgBlack  : '\x1b[40m',
    BgRed    : '\x1b[41m',
    BgGreen  : '\x1b[42m',
    BgYellow : '\x1b[43m',
    BgBlue   : '\x1b[44m',
    BgMagenta: '\x1b[45m',
    BgCyan   : '\x1b[46m',
    BgWhite  : '\x1b[47m'
  }

  const retObj = {}

  Object.keys(colorsMods).forEach(mod => {
    retObj[mod] = () => `${colorsMods[mod]}${str}${colorsMods.Reset}`
  })

  return retObj
}

function log({ text, type }) {
  switch (type) {
    default:
    case 'info':
      console.log(text)
      break
    case 'warning':
      console.warn(text)
      break
    case 'error':
      console.error(text)
      break
  }
}

async function fileExists(path) {
  try {
    const stats = await fileStats(path)

    return stats.isFile()
  } catch (e) {
    return false
  }
}

async function folderExists(path) {
  try {
    const stats = await fileStats(path)

    return stats.isDirectory()
  } catch (e) {
    return false
  }
}

const tsExtensions = [
  'web.ts',
  'ts',
  'web.tsx',
  'tsx'
]

const jsExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'json',
  'web.jsx',
  'jsx'
]

const moduleFileExtensions = tsExtensions.concat(jsExtensions)

function resolveModule(filePath) {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(`${filePath}.${extension}`)
  )

  if(extension)
    return `${filePath}.${extension}`

  return false
}

let packageJson = null
const packageRoute = (process.env.APP_ROOT || process.cwd()) + '/package'
const packagePath = resolveModule(packageRoute)

if(packagePath)
  packageJson = require(packagePath)

const isTs = packageJson && packageJson.crassa && packageJson.crassa.platform == 'ts'

module.exports = {
  copyDir,
  colorize,
  log,
  fileExists,
  capitalize,
  folderExists,
  resolveModule,
  isTs
}
