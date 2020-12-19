const reservedPaths = [
  '/api',
  '/static'
]

export function isReservedPath(path: string): boolean {
  return reservedPaths.some(reservedPath => path.startsWith(reservedPath)) ||
    // files with extension
    path.includes('.')
}
