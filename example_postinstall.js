
'use strict'

const fs = require('fs')
const path = require('path')

// / Delete all files and directories for the given path
const removeFileDirectoryRecursively = fileDirPath => {
  // Remove file
  if(!fs.lstatSync(fileDirPath).isDirectory()) {
    fs.unlinkSync(fileDirPath)

    return
  }

  // Go down the directory an remove each file / directory recursively
  fs.readdirSync(fileDirPath).forEach(entry => {
    const entryPath = path.join(fileDirPath, entry)
    removeFileDirectoryRecursively(entryPath)
  })
  fs.rmdirSync(fileDirPath)
}

// / Remove example/node_modules/crassa-library-name/node_modules directory
const removeLibraryNodeModulesPath = (libraryNodeModulesPath) => {
  const nodeModulesPath = path.resolve(libraryNodeModulesPath, 'node_modules')

  if(!fs.existsSync(nodeModulesPath)) {
    console.log(`No node_modules path found at ${nodeModulesPath}. Skipping delete.`)

    return
  }

  console.log(`Deleting: ${nodeModulesPath}`)
  try {
    removeFileDirectoryRecursively(nodeModulesPath)
    console.log(`Successfully deleted: ${nodeModulesPath}`)
  } catch (err) {
    console.log(`Error deleting ${nodeModulesPath}: ${err.message}`)
  }
}

// / Remove all entries from the .npmignore within  example/node_modules/crassa-library-name/
const removeLibraryNpmIgnorePaths = (npmIgnorePath, libraryNodeModulesPath) => {
  if(!fs.existsSync(npmIgnorePath)) {
    console.log(`No .npmignore path found at ${npmIgnorePath}. Skipping deleting content.`)

    return
  }

  fs.readFileSync(npmIgnorePath, 'utf8').split(/\r?\n/).forEach(entry => {
    if(entry.length === 0)
      return

    const npmIgnoreLibraryNodeModulesEntryPath = path.resolve(libraryNodeModulesPath, entry)
    if(!fs.existsSync(npmIgnoreLibraryNodeModulesEntryPath))
      return

    console.log(`Deleting: ${npmIgnoreLibraryNodeModulesEntryPath}`)
    try {
      removeFileDirectoryRecursively(npmIgnoreLibraryNodeModulesEntryPath)
      console.log(`Successfully deleted: ${npmIgnoreLibraryNodeModulesEntryPath}`)
    } catch (err) {
      console.log(`Error deleting ${npmIgnoreLibraryNodeModulesEntryPath}: ${err.message}`)
    }
  })
};

// Main start sweeping process
(() => {
  // Read out dir of example project
  const exampleDir = process.cwd()

  console.log(`Starting postinstall cleanup for ${exampleDir}`)

  // Resolve the React Native library's path within the example's node_modules directory
  const libraryNodeModulesPath = process.argv.length > 2 ?
    path.resolve(exampleDir, process.argv[2]) :
    path.resolve(exampleDir, 'node_modules', require('./package.json').name)

  console.log(`Removing unwanted artifacts for ${libraryNodeModulesPath}`)

  removeLibraryNodeModulesPath(libraryNodeModulesPath)

  const npmIgnorePath = path.resolve(__dirname, './.npmignore')
  removeLibraryNpmIgnorePaths(npmIgnorePath, libraryNodeModulesPath)
})()
