/* global describe it expect jest */

const path = require('path')
const allFrameworksMethods = ['get', 'getAll']
const frameworkMethods= ['getRef', 'getTitle', 'getSupplier', 'getUrl', 'getCategory', 'toObject']

const frameworkFrame = require('./frameworks')

const testFrameworkData = require(path.resolve(__dirname, '../data/mocks/animals/animal-frameworks.json'))

const allTestFrameworks = frameworkFrame.makeFrameworks(testFrameworkData)

describe('frameworks', () => {
  describe('methods', () => {
    allFrameworksMethods.forEach(methodName => {
      it(`should create a tree object with method: ${methodName}`, () => {
        expect(allTestFrameworks).toHaveProperty(methodName)
      })  
    })
  })

  describe('get', () => {
    it('should find a specific framework by ref', () => {
      const specific = allTestFrameworks.get('beetles')
      expect(specific.getTitle()).toBe('Beetles')
    })
  })

  describe('getAll', () => {
    const all = allTestFrameworks.getAll()
    it('should return a list of all frameworks', () => {
      expect(all).toHaveLength(testFrameworkData.length)
    })
  })
})

describe('framework', () => {
  describe('methods', () => {
    const testFramework = allTestFrameworks.get('snake')
    frameworkMethods.forEach(methodName => {
      it(`should create a framework object with method: ${methodName}`, () => {
        expect(testFramework).toHaveProperty(methodName)
      })  
    })
  })

  describe('basic getters', () => {
    const testFramework = allTestFrameworks.get('beetles')
    it('should be able to return its own reference', () => {
      expect(testFramework.getRef()).toBe('beetles')
    })
 
    it('should be able to return its own title', () => {
      expect(testFramework.getTitle()).toBe('Beetles')
    })

    it('should be able to return its own supplier', () => {
      expect(testFramework.getSupplier()).toBe('BeetleMania')
    })

    it('should be able to return its own url', () => {
      expect(testFramework.getUrl()).toBe('https://beetle.example.com')
    })

    it('should be able to return its own category', () => {
      expect(testFramework.getCategory()).toBe('terrestrial-arthropods')
    })

    it('should be able to return its own description', () => {
      expect(testFramework.getDescr()).toBe('All beetles have biting mouthparts.')
    })

    it('should be able to return its own expiry date', () => {
      expect(testFramework.getExpiry()).toBe('2019-12-25')
    })
  })
})