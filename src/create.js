const path = require('path')
const fs = require('fs')
const childProcess = require('child_process')

const { copyDir, colorize } = require('./util')

const { replaceAll } = require('./cmd')

const { version } = require('../package.json')

async function create({ projectName, projectFolderName, manager, urlTemplate }) {
  const download = require('download-git-repo')
  const rimraf = require('rimraf')
  const folderNameToUse = projectFolderName || projectName
  const pathToUse = path.resolve(process.cwd(), folderNameToUse)
  const [ , name ] = urlTemplate.split('/')
  const tmp = '../tmp'
  const templatePath = tmp + name

  console.log(`Creating project ${colorize(projectName).FgCyan()} in ${colorize(pathToUse).FgCyan()}...`)

  if(fs.existsSync(path.resolve(__dirname, tmp))) {
    if(fs.existsSync(path.resolve(__dirname, tmp, name))) rimraf.sync(path.resolve(__dirname, tmp, name))
    fs.mkdirSync(path.resolve(__dirname, tmp, name))
  } else {
    fs.mkdirSync(path.resolve(__dirname, tmp))
    fs.mkdirSync(path.resolve(__dirname, tmp, name))
  }

  download(urlTemplate, path.resolve(__dirname, templatePath), async function(err) {
    if(err) {
      console.log(err)
    } else {
      await copyDir({
        source     : path.resolve(__dirname, templatePath, 'template'),
        destination: pathToUse
      })

      const packageJSONTemplate = fs.readFileSync(path.resolve(__dirname, templatePath, 'package.json'))
      let packageJSON = replaceAll(packageJSONTemplate.toString(), '{-- project-name --}', projectName)
      packageJSON = replaceAll(packageJSON.toString(), '{-- project-version --}', version)

      // Create real package.json
      fs.writeFileSync(path.join(pathToUse, 'package.json'), packageJSON)

      // Copy .gitignore to real project
      const gitIgnore = fs.readFileSync(path.resolve(__dirname, templatePath, '.gitignore'))
      fs.writeFileSync(path.join(pathToUse, '.gitignore'), gitIgnore)

      // Copy .npmrc to real project
      const npmrc = fs.readFileSync(path.resolve(__dirname, templatePath, '.npmrc'))
      fs.writeFileSync(path.join(pathToUse, '.npmrc'), npmrc)

      const packageManager = {
        install: 'yarn',
        output: 'yarn dev'
      }

      if(manager === 'npm') {
        packageManager.install = 'npm install'
        packageManager.output = 'npm run dev'
      }
      // Install all dependencies
      setTimeout(() => {
        childProcess.execSync('git init .', { cwd: pathToUse })
        childProcess.execSync(packageManager.install, {
          cwd  : pathToUse,
          stdio: 'inherit'
        })
        childProcess.execSync('git add . && git commit -m "Initialized app with crassa!"', { cwd: pathToUse })
        console.log(colorize('Project was successfully created.').FgGreen())
        console.log(colorize('To get started, execute:').FgCyan())
        console.log(colorize(`cd ${folderNameToUse}`).Underscore())
        console.log(colorize(packageManager.output).Underscore())
      }, 300)
    }
  })
}

module.exports = create
