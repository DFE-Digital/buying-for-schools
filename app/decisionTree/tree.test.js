/* global describe it expect jest */

const treeSkeleton = require('./tree')

const testTreeData = [
  { 
    ref: 'a',
    title: 'A',
    options: [
      {
        ref: 'b',
        title: 'B',
        result: ['c']
      }
    ]
  },
  {
    ref: 'd',
    options: []
  }
]
const testTree = treeSkeleton(testTreeData)

describe('tree', () => {
  describe('methods', () => {
    const treeMethods = ['getFirst', 'getBranch', 'getBranches', 'getAllPaths']
    treeMethods.forEach(methodName => {
      it(`should create a tree object with method: ${methodName}`, () => {
        expect(testTree).toHaveProperty(methodName)
      })  
    })

    const branchMethods = ['getRef', 'getTitle', 'getErr', 'getHint', 'getSuffix', 'getOptions', 'getOption', 'toObject']
    branchMethods.forEach(methodName => {
      it(`should create a branch object with method: ${methodName}`, () => {
        expect(testTree.getBranch('a')).toHaveProperty(methodName)
      })  
    })

    const optionMethods = ['getRef', 'getTitle', 'getNext', 'getHint', 'getResult', 'toObject']
    optionMethods.forEach(methodName => {
      it(`should create an option object with method: ${methodName}`, () => {
        expect(testTree.getBranch('a').getOption('b')).toHaveProperty(methodName)
      })  
    })
  })

  describe('getFirst', () => {
    it('should be able to get the first branch in the data file', () => {
      const first = testTree.getFirst()
      expect(first.getRef()).toEqual('a')
    })
  })

  describe('getBranches', () => {
    it('should return the original list of input data transformed into branch objects', () => {
      const branches = testTree.getBranches()
      expect(branches.length).toEqual(2)
      expect(branches[0]).toHaveProperty('getRef')
    })

    it('should not be possible to add or remove items from the returned branches array', () => {
      const branches = testTree.getBranches()
      expect(() => branches.push(3)).toThrow()
      expect(() => branches.pop()).toThrow()
      expect(() => branches.shift()).toThrow()
      expect(branches.length).toEqual(2)
    })
  })
})