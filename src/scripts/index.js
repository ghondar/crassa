const path = require('path')
const { execCmd, fileExists } = require('../util')

const { appRootPath, packageRootPath } = require('../paths')

function countLines() {
  return execCmd(`npx cloc ${appRootPath} --exclude-dir=node_modules,.git,build --exclude-ext=json`)
}

function lint() {
  execCmd(`npx eslint ${appRootPath}/{src,server}/**/*.js* --fix --config ${appRootPath}/.eslintrc`, {
    async: true
  })
}

function dev() {
  const cmd = `
        npx cross-env
          APP_ROOT=${appRootPath}
            npx node ${packageRootPath}/start.js`
  execCmd(cmd, { async: true })
}

function build() {
  const cmd = `
          npx cross-env
            NODE_ENV=development
              npx cross-env
                APP_ROOT=${appRootPath}
                  npx node ${packageRootPath}/build.js`
  execCmd(cmd, { async: true })
}

function start() {
  const cmd = `
          npx cross-env
            NODE_ENV=production
              npx cross-env
                APP_IT_ROOT=${packageRootPath}
                  npx cross-env
                    APP_ROOT=${appRootPath}
                      npx node ${packageRootPath}/server/index.js`
  execCmd(cmd, { async: true })
}

const commands = [
  {
    name       : 'dev',
    fn         : dev,
    description: 'Concurrently starts the frontend and the backend in development mode.'
  },
  {
    name       : 'lint',
    fn         : lint,
    description: 'Executes eslint in autofix mode.'
  },
  {
    name       : 'build',
    fn         : build,
    description: 'Creates a production build for the frontend application.'
  },
  {
    name       : 'start',
    fn         : start,
    description: 'Run the project with server side.'
  },
  {
    name       : 'count-lines',
    fn         : countLines,
    description: "See how many LOC you've already written."
  }
]

async function preHook() {
  // Executed before each of the above cmds is executed (for validation purpose)
  // Returns true if validation was successful, false otherwise

  // All of the above commands require the project to be a crassa project

  // See if the current package.json has a crassa field
  const error = 'The current directory is not a crassa project!'

  const packageJSONpath = path.join(appRootPath, 'package.json')
  if(!(await fileExists(packageJSONpath))) return { error }
  /* eslint-disable-next-line */
  const packageJSON = require(packageJSONpath)
  if(!packageJSON.crassa) return { error }

  return { success: true }
}

module.exports = {
  commands,
  preHook
}
