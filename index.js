#!/usr/bin/env node
const program = require('commander')
const inquirer = require('inquirer')

const createProject = require('./src/create')
const { commands, preHook } = require('./src/scripts')
const { log, colorize } = require('./src/util')

const { version } = require('./package.json')

program.version(version).description('Create client + server apps with one CLI command. Easy. Unobstrusive. Powerful.')

program
  .command('init <projectName> [projectFolderName]')
  .description('Initialize a project.')
  .action((projectName, projectFolderName) => {
    inquirer
      .prompt([
        {
          type     : 'list',
          name     : 'manager',
          message  : 'Package Manager',
          choices  : [ 'npm', 'yarn' ],
          'default': 'yarn'
        }
      ])
      .then(({ manager }) => {
        createProject({ projectName, projectFolderName, manager })
      })
  })

commands.forEach(({ name, fn, description = '' }) => {
  program
    .command(name)
    .description(description)
    .action(async () => {
      const { error } = await preHook()
      if(!error) fn()
      else log({ text: colorize(error).FgRed(), type: 'error' })
    })
})

program.parse(process.argv)
