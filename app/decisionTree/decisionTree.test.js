/* global describe it expect */
/* global Map:true */

const {List, Map, fromJS} = require('immutable')
const dt = require('./decisionTree')

describe('decisionTree', () => {
  describe('makeTree', () => {
    it('should return an immutable List', () => {
      const testOjb = [{ref: 'hello', title: 'Hello world'}]
      const tree = dt.makeTree(testOjb)
      expect(List.isList(tree)).toBeTruthy()
    })
  })

  describe('getBranch', () => {
    it('should be able to find a branch by it\'s ref', () => {
      const testOjb = [
        {ref: 'hello', title: 'Hello world'},
        {ref: 'bye', title: 'GoodBye'},
        {ref: 'ciao', title: 'Italian hi/bye'}
      ]
      const tree = dt.makeTree(testOjb)
      const foundBranch = dt.getBranch(tree, 'bye')
      expect(foundBranch.get('ref')).toBe('bye')
      expect(foundBranch.get('title')).toBe('GoodBye')
    })

    it('should return undefined if there is no branch with that ref', () => {
      const testOjb = [
        {ref: 'hello', title: 'Hello world'},
        {ref: 'bye', title: 'GoodBye'},
        {ref: 'ciao', title: 'Italian hi/bye'}
      ]
      const tree = dt.makeTree(testOjb)
      const foundBranch = dt.getBranch(tree, 'ocelot')
      expect(foundBranch).toBe(undefined)
    })
  })

  describe('getOption', () => {
    it('should be able to find a specific option by ref', () => {
      const testBranch = fromJS({
        ref: 'branch',
        options: [
          {ref: 'a', title: 'Apple'},
          {ref: 'b', title: 'Banana'},
          {ref: 'c', title: 'Cherry'}
        ]
      })

      let foundOption = dt.getOption(testBranch, 'a')
      expect(Map.isMap(foundOption)).toBeTruthy()
      expect(foundOption.get('title')).toBe('Apple')

      foundOption = dt.getOption(testBranch, 'c')
      expect(Map.isMap(foundOption)).toBeTruthy()
      expect(foundOption.get('title')).toBe('Cherry')
    })

    it('should return undefined if there is no option with that ref', () => {
      const testBranch = fromJS({
        ref: 'branch',
        options: [
          {ref: 'a', title: 'Apple'},
          {ref: 'b', title: 'Banana'},
          {ref: 'c', title: 'Cherry'}
        ]
      })

      let foundOption = dt.getOption(testBranch, 'x')
      expect(foundOption).toBe(undefined)
    })
  })

  describe('getOptionKey', () => {
    it('should be able to find a specific option\'s index by ref', () => {
      const testBranch = fromJS({
        ref: 'branch',
        options: [
          {ref: 'a', title: 'Apple'},
          {ref: 'b', title: 'Banana'},
          {ref: 'c', title: 'Cherry'}
        ]
      })

      let foundOptionKey = dt.getOptionKey(testBranch, 'a')
      expect(foundOptionKey).toEqual(0)

      foundOptionKey = dt.getOptionKey(testBranch, 'c')
      expect(foundOptionKey).toEqual(2)
    })

    it('should return undefined if there is no option with that ref', () => {
      const testBranch = fromJS({
        ref: 'branch',
        options: [
          {ref: 'a', title: 'Apple'},
          {ref: 'b', title: 'Banana'},
          {ref: 'c', title: 'Cherry'}
        ]
      })

      let foundOptionKey = dt.getOptionKey(testBranch, 'x')
      expect(foundOptionKey).toBe(undefined)
    })
  })

  describe('setSelectedOption', () => {
    it('should update the option to selected true', () => {
      const testBranch = fromJS({
        ref: 'branch',
        options: [
          {ref: 'a', title: 'Apple'},
          {ref: 'b', title: 'Banana'},
          {ref: 'c', title: 'Cherry'}
        ]
      })

      const branchWithSelection = dt.setSelectedOption(testBranch, 'b')
      expect(branchWithSelection.getIn(['options', 1, 'title'])).toBe('Banana')
    })

    it('should return the unchanged branch if an invalid option is chosen', () => {
      const testBranch = fromJS({
        ref: 'branch',
        options: [
          {ref: 'a', title: 'Apple'},
          {ref: 'b', title: 'Banana'},
          {ref: 'c', title: 'Cherry'}
        ]
      })

      const branchWithSelection = dt.setSelectedOption(testBranch, 'z')
      expect(branchWithSelection === testBranch).toBeTruthy()
    })
  })
})
