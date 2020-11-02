const path = require('path')
const { templateCommands } = require('./template')
const { fileExists } = require('../util')
const { execCmd } = require('../cmd')

const { appRootPath, packageRootPath } = require('../paths')

function countLines() {
  return execCmd(`npx cloc ${appRootPath} --exclude-dir=node_modules,.git,build --exclude-ext=json`)
}

function lint() {
  execCmd(`npx eslint ${appRootPath}/{src,server}/**/*.{js,ts,tsx} --fix --config ${appRootPath}/.eslintrc`, {
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

function buildServer() {
  const cmd = `
        npx tsc -p ${packageRootPath}/tsconfig.json --noEmit false --module CommonJS`
  execCmd(cmd, { async: true })
}

function devServer() {
  const argv = process.argv
  const args = argv.slice(3, argv.length)

  const cmd = `
npx cross-env
  NODE_ENV=development
    npx cross-env
      APP_IT_ROOT=${packageRootPath}
        npx cross-env
          APP_ROOT=${appRootPath}
            npx nodemon ${args.join(' ')} -e js,ts,tsx --watch '${appRootPath}/server/**/*.{js,ts,tsx}' --ignore 'src/**/*.spec.{js,ts,tsx}' --exec node -r ts-node/register ${packageRootPath}/server/index.ts`
  execCmd(cmd, { async: true })
}

function dev() {
  devClient()
  devServer()
}

function build() {
  const cmd = `
          npx cross-env
            INLINE_RUNTIME_CHUNK=false
              npx cross-env
                GENERATE_SOURCEMAP=false 
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
                      npx node ${packageRootPath}/lib/server/index.js`
  execCmd(cmd, { async: true })
}

function startDev() {
  const argv = process.argv
  const args = argv.slice(3, argv.length)

  const cmd = `
          npx cross-env
            NODE_ENV=production
              npx cross-env
                APP_IT_ROOT=${packageRootPath}
                  npx cross-env
                    APP_ROOT=${appRootPath}
                      npx nodemon ${args.join(' ')} -e js,ts,tsx --watch '${appRootPath}/server/**/*.{js,ts,tsx}' --ignore 'src/**/*.spec.{js,ts,tsx}' --exec node -r ts-node/register ${packageRootPath}/server/index.ts`
  execCmd(cmd, { async: true })
}

function test() {
  const argv = process.argv
  const args = argv.slice(3, argv.length)

  const cmd = `
          npx cross-env
            NODE_ENV=development
              npx cross-env
                APP_IT_ROOT=${packageRootPath}
                  npx cross-env
                    APP_ROOT=${appRootPath}
                      npx node ${packageRootPath}/test.js ${args.join(' ')}`
  execCmd(cmd, { async: true })
}

const commands = [
  {
    name       : 'dev',
    fn         : dev,
    description: 'Concurrently starts the frontend and the backend in development mode.'
  },
  {
    name       : 'dev-server',
    fn         : devServer,
    description: ''
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
    name       : 'server-build',
    fn         : buildServer,
    description: 'build server project'
  },
  {
    name       : 'start',
    fn         : start,
    description: 'Run the project with server side.'
  },
  {
    name       : 'start-dev',
    fn         : startDev,
    description: 'Run the project with server side using nodemon.'
  },
  {
    name       : 'test',
    fn         : test,
    description: 'Run the test files.'
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
  commands: commands.concat(templateCommands),
  preHook
}
