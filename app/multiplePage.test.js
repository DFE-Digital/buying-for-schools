/* global describe it expect jest */

const multiplePage = require('./multiplePage')

describe('multiplePage', () => {
  it('should return a function when passed an app parameter', () => {
    const app = {}
    const mp = multiplePage(app)
    expect(typeof mp).toBe('function')
  })
})