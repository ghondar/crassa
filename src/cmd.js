const childProcess = require('child_process')
const { packageRootPath } = require('./paths')

function sanitizedCmdInput(cmd) {
  return replaceAll(cmd, '\n', '')
    .split(' ')
    .filter(s => s)
    .join(' ')
}

function prepareCmd(sanitizedCmd) {
  const splitted = sanitizedCmd.split(' ')

  return {
    cmd : splitted[0],
    argv: splitted.slice(1, splitted.length)
  }
}

function execCmd(cmd, { async = false, cwd = packageRootPath } = {}) {
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

module.exports = {
  execCmd
}
