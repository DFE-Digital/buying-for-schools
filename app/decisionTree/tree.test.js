/* global describe it expect jest */
const treeMethods = ['getFirst', 'getBranch', 'getBranches', 'getAllPaths']
const branchMethods = ['getRef', 'getTitle', 'getErr', 'getHint', 'getSuffix', 'getOptions', 'getOption', 'toObject']
const branchProperties = ['ref', 'title', 'err', 'hint', 'suffix', 'options']
const optionMethods = ['getRef', 'getTitle', 'getNext', 'getHint', 'getResult', 'toObject']
const optionProperties = ['ref', 'title', 'next', 'hint', 'result']
const trees = require('./tree')

const testTreeData = [
  { 
    ref: 'a',
    title: 'A',
    hint: 'Animal beginning with A',
    suffix: 'Afterwards',
    err: 'This is very bad',
    options: [
      {
        ref: 'b',
        title: 'B',
        hint: 'B is for Bison',
        result: ['c']
      },
      {
        ref: 'e',
        title: 'E',
        result: ['c']
      }
    ]
  },
  {
    ref: 'd',
    options: []
  }
]
const testTree = trees.makeTree(testTreeData)

describe('tree', () => {
  describe('methods', () => {
    
    treeMethods.forEach(methodName => {
      it(`should create a tree object with method: ${methodName}`, () => {
        expect(testTree).toHaveProperty(methodName)
      })  
    })

    branchMethods.forEach(methodName => {
      it(`should create a branch object with method: ${methodName}`, () => {
        expect(testTree.getBranch('a')).toHaveProperty(methodName)
      })  
    })

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

  describe('makeBranch', () => {
    const testBranch = trees.makeBranch(testTreeData[0])
    const testObj = testBranch.toObject()

    it('should make a branch object', () => {
      branchMethods.forEach(methodName => {
        expect(testBranch).toHaveProperty(methodName)
      })
    })
  
    branchProperties.forEach(propName => {
      it(`branch.toObject() should have property ${propName}`, () => {
        expect(testObj).toHaveProperty(propName)  
      })
    })
  
    it('should be able to return the ref', () => {
      expect(testBranch.getRef()).toEqual('a')
    })

    it('should be able to return the title', () => {
      expect(testBranch.getTitle()).toEqual('A')
    })

    it('should be able to return the hint', () => {
      expect(testBranch.getHint()).toEqual('Animal beginning with A')
    })

    it('should be able to return the suffix', () => {
      expect(testBranch.getSuffix()).toEqual('Afterwards')
    })

    it('should be able to return the err', () => {
      expect(testBranch.getErr()).toEqual('This is very bad')
    })
    
    it('should not be possible to add remove options', () => {
      const options = testBranch.getOptions()
      expect(() => options.push(3)).toThrow()
      expect(() => options.pop()).toThrow()
      expect(() => options.shift()).toThrow()
      expect(options.length).toEqual(2)
    })
  })

  describe('makeOption', () => {
    const testOption = trees.makeOption(testTreeData[0].options[0])
    const testObj = testOption.toObject()

    it('should make an option object', () => {
      optionMethods.forEach(methodName => {
        expect(testOption).toHaveProperty(methodName)
      })
    })
    
    optionProperties.forEach(propName => {
      it(`option.toObject() should have property ${propName}`, () => {
        expect(testObj).toHaveProperty(propName)  
      })
    })

    it('should be able to return the ref', () => {
      expect(testOption.getRef()).toEqual('b')
    })

    it('should be able to return the title', () => {
      expect(testOption.getTitle()).toEqual('B')
    })

    it('should be able to return the hint', () => {
      expect(testOption.getHint()).toEqual('B is for Bison')
    })

    it('should return an array of results', () => {
      expect(testOption.getResult()).toEqual(['c'])
    })

    it('should NOT be possible to add or remove items from the results', () => {
      const results = testOption.getResult()
      expect(() => results.push(3)).toThrow()
      expect(() => results.pop()).toThrow()
      expect(() => results.shift()).toThrow()
      expect(results.length).toEqual(1)
    })
  })
})