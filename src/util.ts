import { ncp } from 'ncp'
import childProcess from 'child_process'
import fs from 'fs'
import { promisify } from 'util'

const fileStats = promisify(fs.stat)

const { packageRootPath } = require('./paths')

interface Directory {
  source: string;
  destination: string;
}

export const copyDir = ({ source, destination }: Directory) => {
  return new Promise((resolve, reject) => {
    ncp(source, destination, (err: any) => {
      if(err) {
        console.error('Error while copying folder contents.', err)
        reject(err)

        return
      }
      resolve()
    })
  })
}

export const replaceAll = (str: string, what: string, withThat: string) => {
  let retStr = str
  while (retStr.includes(what)) retStr = retStr.replace(what, withThat)

  return retStr
}

export const colorize = (str: string) => {
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

  const retObj = {
    Reset     : () => '',
    Bright    : () => '',
    Dim       : () => '',
    Underscore: () => '',
    Blink     : () => '',
    Reverse   : () => '',
    Hidden    : () => '',

    FgBlack  : () => '',
    FgRed    : () => '',
    FgGreen  : () => '',
    FgYellow : () => '',
    FgBlue   : () => '',
    FgMagenta: () => '',
    FgCyan   : () => '',
    FgWhite  : () => '',

    BgBlack  : () => '',
    BgRed    : () => '',
    BgGreen  : () => '',
    BgYellow : () => '',
    BgBlue   : () => '',
    BgMagenta: () => '',
    BgCyan   : () => '',
    BgWhite  : () => ''
  }

  Object.keys(colorsMods).forEach(mod => {
    retObj[mod] = () => `${colorsMods[mod]}${str}${colorsMods.Reset}`
  })

  return retObj
}

export const sanitizedCmdInput = (cmd: string) => {
  return replaceAll(cmd, '\n', '')
    .split(' ')
    .filter(s => s)
    .join(' ')
}

export const prepareCmd = (sanitizedCmd: string) => {
  const splitted = sanitizedCmd.split(' ')

  return {
    cmd : splitted[0],
    argv: splitted.slice(1, splitted.length)
  }
}

export const execCmd = (cmd: string, { async = false, cwd = packageRootPath } = {}) => {
  if(async) {
    const sanitizedCmd = sanitizedCmdInput(cmd)
    // const allCmds = sanitizedCmd.split('&&').map(c => c.split('&')).flat();

    const preparedCmd = prepareCmd(sanitizedCmd)
    childProcess.spawn(preparedCmd.cmd, preparedCmd.argv, {
      cwd,
      stdio: 'inherit',
      shell: true
    })

    return true
  }

  childProcess.execSync(cmd, { cwd, stdio: 'inherit' })

  return true
}

interface Log {
  text: string;
  type: string;
}

export const log = ({ text, type }: Log) => {
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

export const fileExists = async (path: string) => {
  try {
    const stats = await fileStats(path)

    return stats.isFile()
  } catch (e) {
    return false
  }
}
