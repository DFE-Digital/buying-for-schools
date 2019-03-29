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

  describe('getSelectedOption', () => {
    it('shuld get a previously selected option', () => {
      const testBranch = fromJS({
        ref: 'branch',
        options: [
          {ref: 'a', title: 'Apple'},
          {ref: 'b', title: 'Banana', selected: true},
          {ref: 'c', title: 'Cherry'}
        ]
      })

      const option = dt.getSelectedOption(testBranch)
      expect(option.get('ref')).toEqual('b')
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

  describe('getAllBranchPaths', () => {
    const testTree = fromJS([
      {
        ref: 'music',
        options: [
          { ref: 'queen', title: 'Queen', next: 'queen-songs' },
          { ref: 'hard-rock', title: 'Hard Rock', result: ['ac-dc', 'led-zeppelin'] }
        ]
      },
      {
        ref: 'queen-songs',
        options: [
          { ref: 'bohemian-rhapsody', title: 'Bohemian Rhapsody', result: ['1975', '1991'] },
          { ref: 'kind-magic', title: 'Kind of Magic', result: ['highlander'] }
        ]
      }
    ])
    const allPaths = dt.getAllBranchPaths(testTree)

    it('should compile a list of all branches in groups', () => {
      expect(allPaths).toHaveProperty('questions')
      expect(allPaths).toHaveProperty('redirectToQuestion')
      expect(allPaths).toHaveProperty('redirectToResult')
      expect(allPaths).toHaveProperty('results')
      expect(allPaths).toHaveProperty('multiple')
    })

    it('should have question paths', () => {
      expect(allPaths.questions.length).toBe(2)
      expect(allPaths.questions).toContain('music')
      expect(allPaths.questions).toContain('music/queen/queen-songs')
    })

    it('should have redirect to questions', () => {
      expect(allPaths.redirectToQuestion.length).toBe(1)
      expect(allPaths.redirectToQuestion).toContain('music/queen')
    })

    it('should have redirect to results', () => {
      expect(allPaths.redirectToResult.length).toBe(1)
      expect(allPaths.redirectToResult).toContain('music/queen/queen-songs/kind-magic')
    })

    it('should have results', () => {
      expect(allPaths.results.length).toBe(5)
      expect(allPaths.results).toContain('music/queen/queen-songs/bohemian-rhapsody/1975')
      expect(allPaths.results).toContain('music/queen/queen-songs/bohemian-rhapsody/1991')
      expect(allPaths.results).toContain('music/queen/queen-songs/kind-magic/highlander')
      expect(allPaths.results).toContain('music/hard-rock/ac-dc')
      expect(allPaths.results).toContain('music/hard-rock/led-zeppelin')
    })

    it('should have pages where there are multiple results', () => {
      expect(allPaths.multiple.length).toBe(2)
      expect(allPaths.multiple).toContain('music/hard-rock')
      expect(allPaths.multiple).toContain('music/queen/queen-songs/bohemian-rhapsody')
    })
  })
})
