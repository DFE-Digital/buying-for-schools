/* global describe it expect jest */
const path = require('path')
const treeUtils = require('./treeUtils')
const { getAllBranchPaths, getQuestionAnswerSummary } = treeUtils

const trees = require('./tree')
const animalTree = trees.makeTree(require(path.resolve(__dirname, '../data/mocks/animals/animal-tree.json')))

describe('treeUtils', () => {
  describe('getAllBranchPaths', () => {
    let allPaths = treeUtils.getAllBranchPaths(animalTree)
    // console.log(allPaths)
    it('should produce an object with path types', () => {
      allPaths = treeUtils.getAllBranchPaths(animalTree)
      expect(allPaths).toHaveProperty('questions')
      expect(allPaths).toHaveProperty('redirectToQuestion')
      expect(allPaths).toHaveProperty('redirectToResult')
      expect(allPaths).toHaveProperty('results')
      expect(allPaths).toHaveProperty('multiple')
    })

    it('should have 8 question paths', () => {
      expect(allPaths.questions.length).toBe(7)
    })

    it('should have 6 redirect to question paths', () => {
      expect(allPaths.redirectToQuestion.length).toBe(6)
    })

    it('should have 1 redirect to result paths', () => {
      expect(allPaths.redirectToResult.length).toBe(1)
    })

    it('should have 17 results paths', () => {
      expect(allPaths.results.length).toBe(17)
    })

    it('should have 7 multiple paths', () => {
      expect(allPaths.multiple.length).toBe(7)
    })
  })

  describe('getQuestionAnswerSummary', () => {
    
    // console.log(summ)
    it('should produce a summary', () => {
      const summ = treeUtils.getQuestionAnswerSummary(animalTree, {type: 'vertebrate', verttype: 'warm'})
      expect(summ.length).toBe(2)
    })

    it('should have certain properties in each summary item', () => {
      const summ = treeUtils.getQuestionAnswerSummary(animalTree, {type: 'vertebrate', verttype: 'warm'})
      summ.forEach(s => {
        expect(s).toHaveProperty('key')
        expect(s).toHaveProperty('value')
        expect(s).toHaveProperty('actions')
      })
    })

    it('should stop when a branch is not available', () => {
      const summ = treeUtils.getQuestionAnswerSummary(animalTree, {type: 'vertebrate', foo: 'bar'})
      expect(summ.length).toBe(1)
    })
  })
})