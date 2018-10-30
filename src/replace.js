function replaceRootPath(path) {
  if(path) return this.appRootPath + '/' + path
  else return this.appRootPath
}

module.exports = {
  replaceRootPath
}
