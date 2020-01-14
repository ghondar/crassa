#!/usr/bin/env -S node -r "ts-node/register"
import program from 'commander'
import inquirer from 'inquirer'

import createProject from './src/create'
import { commands, preHook } from './src/scripts'
import { log, colorize } from './src/util'

const { version } = require('./package.json')

program.version(version).description('Create client + server apps with one CLI command. Easy. Unobstrusive. Powerful.')

program
  .command('init <projectName> [projectFolderName]')
  .description('Initialize a project.')
  .action(async (projectName, projectFolderName) => {
    let urlTemplate = 'ghondar/counter-with-redux-ducks-and-sagas-template'
    const { manager, template } = await inquirer.prompt([
      {
        type     : 'list',
        name     : 'manager',
        message  : 'Choose Package Manager:',
        choices  : [ 'yarn', 'npm' ],
        'default': 'yarn'
      },
      {
        type     : 'list',
        name     : 'template',
        message  : 'Choose Template:',
        choices  : [ 'default', 'next', 'custom' ],
        'default': 'default'
      }
    ])

    if(template === 'next') {
      urlTemplate = urlTemplate + '#next'
    } else if(template === 'custom') {
      const { url } = await inquirer.prompt([
        {
          type   : 'input',
          name   : 'url',
          message: 'Git URL Template:'
        }
      ])
      urlTemplate = url
    }

    createProject({ projectName, projectFolderName, manager, urlTemplate })
  })

commands.forEach(({ name, fn, description = '' }) => {
  program
    .command(name)
    .allowUnknownOption()
    .description(description)
    .action(async () => {
      const { error } = await preHook()
      if(!error) fn()
      else log({ text: colorize(error).FgRed(), type: 'error' })
    })
})

program.parse(process.argv)
