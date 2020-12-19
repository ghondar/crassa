import { isReservedPath } from './is-reserved-path.helper'

describe(isReservedPath.name, () => {
  it('should be true if path does an strict match', () => {
    expect(isReservedPath('/.')).toBe(true)
    expect(isReservedPath('/api')).toBe(true)
    expect(isReservedPath('/static')).toBe(true)

    // api versions
    expect(isReservedPath('/api/v1')).toBe(true)

    // static files
    expect(isReservedPath('/static/image.png')).toBe(true)
  })

  it('should be false if path does not an strict match', () => {
    // ends
    expect(isReservedPath('/strapi')).toBe(false)
    expect(isReservedPath('/bar-static')).toBe(false)
    
    // others
    expect(isReservedPath('/random-path')).toBe(false)
  })
})