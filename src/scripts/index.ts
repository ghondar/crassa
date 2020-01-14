import path from 'path'

import { execCmd, fileExists } from '../util'
import { appRootPath, packageRootPath } from '../paths'

function countLines() {
  return execCmd(`npx cloc ${appRootPath} --exclude-dir=node_modules,.git,build --exclude-ext=json`)
}

function lint() {
  execCmd(`npx eslint ${appRootPath}/{src,server}/**/*.js* --fix --config ${appRootPath}/.eslintrc`, {
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

function devServer() {
  const cmd = `
          npx cross-env
            NODE_ENV=development
              npx cross-env
                APP_IT_ROOT=${packageRootPath}
                  npx cross-env
                    APP_ROOT=${appRootPath}
                      npx nodemon --watch ${appRootPath}/server --config ${appRootPath}/nodemon.json ${packageRootPath}/build/server/index.js`
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
                      npx ts-node ${packageRootPath}/server/index.ts`
  execCmd(cmd, { async: true })
}

function startDev() {
  const cmd = `
          npx cross-env
            NODE_ENV=production
              npx cross-env
                APP_IT_ROOT=${packageRootPath}
                  npx cross-env
                    APP_ROOT=${appRootPath}
                      npx nodemon --watch ${appRootPath}/server --config ${appRootPath}/nodemon.json ${packageRootPath}/build/server/index.js`
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

export const commands = [
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

export const preHook = async () => {
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
