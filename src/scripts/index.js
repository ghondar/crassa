const path = require('path')
const { execCmd, fileExists } = require('../util')

const { appRootPath, appShared, appClient, packageRootPath, appServer } = require('../paths')

function countLines() {
  return execCmd(`npx cloc ${appRootPath} --exclude-dir=node_modules,.git,build --exclude-ext=json`)
}

function lintClient() {
  // Execute linting in parallel
  execCmd(`npx eslint ${appClient}/**/*.js* --fix --config ${packageRootPath}/.eslintrc`, {
    async: true
  })
  execCmd(`npx eslint ${appShared}/**/*.js* --fix --config ${packageRootPath}/.eslintrc`, {
    async: true
  })
  execCmd(`npx stylelint ${appClient}/**/*.css --fix --config ${packageRootPath}/.stylelintrc`, {
    async: true
  })
  execCmd(`npx stylelint ${appShared}/**/*.css --fix --config ${packageRootPath}/.stylelintrc`, {
    async: true
  })
}

function devClient() {
  const cmd = `
        npx cross-env
          APP_ROOT=${appRootPath}
            npx node ${packageRootPath}/start.js`
  execCmd(cmd, { async: true })
}

function lintServer() {
  execCmd(`npx eslint ${appServer} --fix`, { async: true })
  execCmd(`npx eslint ${appShared} --fix`, { async: true })
}

function devServer() {
  const cmd = `
    npx cross-env crassa_MODE=development
    npx cross-env BABEL_ENV=node
    npx nodemon
      --ext js,graphql
      --inspect
      --watch ${appServer}
      --watch ${appShared}
      ${appServer}/start-server.js
  `
  lintServer()
  execCmd(cmd, { async: true })
}

function dev() {
  devClient()
}

function buildClient() {
  const cmd = `
          npx cross-env
            NODE_ENV=development
              npx cross-env
                APP_ROOT=${appRootPath}
                  npx node ${packageRootPath}/build.js`
  execCmd(cmd, { async: true })
}

function build() {
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

function start() {
  const cmd = `npx cross-env
                  APP_ROOT=${appRootPath}
                    npx node ${appServer}/start-server.js`
  execCmd(cmd, { async: true })
}

const commands = [
  {
    name       : 'dev',
    fn         : dev,
    description: 'Concurrently starts the frontend and the backend in development mode.'
  },
  {
    name       : 'count-lines',
    fn         : countLines,
    description: "See how many LOC you've already written."
  },
  {
    name       : 'lint:client',
    fn         : lintClient,
    description: 'Executes eslint in autofix mode for your client files (src/client + src/shared).'
  },
  {
    name       : 'lint:server',
    fn         : lintServer,
    description: 'Executes eslint in autofix mode for your server files (src/server + src/shared).'
  },
  {
    name       : 'dev:client',
    fn         : devClient,
    description: 'Starts the webpack development server for the frontend.'
  },
  {
    name       : 'dev:server',
    fn         : devServer,
    description: 'Starts the node.js backend in development mode with live-reload.'
  },
  {
    name       : 'start',
    fn         : start,
    description: 'Starts the node.js server for production.'
  },
  {
    name       : 'build',
    fn         : build,
    description: 'Creates a production build for the frontend application.'
  },
  {
    name       : 'build:client',
    fn         : buildClient,
    description: 'Creates a production build for the frontend application.'
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
