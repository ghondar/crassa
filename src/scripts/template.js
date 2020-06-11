const { execCmd } = require('../util')

const { appRootPath } = require('../paths')

async function plopGenerate() {
  const argv = process.argv
  const params = argv.slice(3, argv.length)

  const cmd = `npx cross-env
                APP_ROOT=${appRootPath}
                  npx plop ${params.join(' ')}`
  execCmd(cmd, { async: true })
}

const templateCommands = [
  {
    name       : 'generate',
    fn         : plopGenerate,
    description: 'Generate a reducer with a name.'
  },
  {
    name       : 'g',
    fn         : plopGenerate,
    description: 'Generate a template with a name.'
  }
]

module.exports = {
  templateCommands
}
