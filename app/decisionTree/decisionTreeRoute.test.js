/* global describe it expect */
/* global Map:true */

const { is, Map, fromJS } = require('immutable')

const dtr = require('./decisionTreeRoute')
const dt = require('./decisionTree')
const dtres = require('./decisionTreeResults')

describe('decisionTreeRoute', () => {
  describe('getQuestionAnswerPairSlugs', () => {
    it('should separate url paths into pairs of question and answer slugs', () => {
      const fruits = dtr.getQuestionAnswerPairSlugs('a/apple/b/banana/c/cherry')
      expect(is(fruits, Map({
        a: 'apple',
        b: 'banana',
        c: 'cherry'
      }))).toBeTruthy()

      const music = dtr.getQuestionAnswerPairSlugs('band/queen/album/night-at-opera/song/')
      expect(is(music, Map({
        band: 'queen',
        album: 'night-at-opera',
        song: undefined
      }))).toBeTruthy()

      const qa = dtr.getQuestionAnswerPairSlugs('/q1/a1/q2/')
      expect(is(qa, Map({
        q1: 'a1',
        q2: undefined
      })))

      const slashed = dtr.getQuestionAnswerPairSlugs('/type/')
      expect(is(slashed, Map({
        q1: 'type',
        q2: undefined
      })))

      const blankSlash = dtr.getQuestionAnswerPairSlugs('/') 
      expect(is(blankSlash, Map({})))
    })
  })

  describe('getBranchPath', () => {
    describe('get the branches that have been selected by question answer pairs', () => {
      const tree = dt.makeTree([
        {
          ref: 'artist',
          options: [
            { ref: 'queen' },
            { ref: 'ac-dc' },
            { ref: 'led-zeppelin' }
          ]
        },
        {
          ref: 'album',
          options: [
            { ref: 'night-at-opera' },
            { ref: 'iron-man' },
            { ref: 'mothership' }
          ]
        },
        {
          ref: 'song',
          options: [
            { ref: 'bohemian-rhapsody' },
            { ref: 'tnt' },
            { ref: 'kashmir' }
          ]
        }
      ])

      it('should work with short branches', () => {
        const pairs = fromJS({ artist: 'queen' })
        const branches = dtr.getBranchPath(tree, pairs)
        expect(branches.size).toBe(1)
        expect(branches.getIn([0, 'ref'])).toBe('artist')
        expect(branches.getIn([0, 'options', 0, 'ref'])).toBe('queen')
        expect(branches.getIn([0, 'options', 0, 'selected'])).toBeTruthy()
      })

      it('should work with longer branches', () => {
        const pairs = fromJS({ artist: 'ac-dc', song: 'tnt' })
        const branches = dtr.getBranchPath(tree, pairs)
        expect(branches.size).toBe(2)
        expect(branches.getIn([0, 'options', 1, 'selected'])).toBeTruthy()
        expect(branches.getIn([1, 'ref'])).toBe('song')
        expect(branches.getIn([1, 'options', 1, 'selected'])).toBeTruthy()
      })

      it('should find branches that end without a chosen answer', () => {
        const pairs = fromJS({ artist: 'led-zeppelin', song: 'kashmir', album: undefined })
        const branches = dtr.getBranchPath(tree, pairs)
        expect(branches.size).toBe(3)
        expect(branches.getIn([0, 'ref'])).toBe('artist')
        expect(branches.getIn([0, 'options', 2, 'selected'])).toBeTruthy()
        expect(branches.getIn([1, 'ref'])).toBe('song')
        expect(branches.getIn([1, 'options', 2, 'selected'])).toBeTruthy()
        expect(branches.getIn([2, 'ref'])).toBe('album')
        expect(branches.getIn([2, 'options', 0, 'selected'])).toBeFalsy()
        expect(branches.getIn([2, 'options', 1, 'selected'])).toBeFalsy()
        expect(branches.getIn([2, 'options', 2, 'selected'])).toBeFalsy()
      })
    })
  })

  describe('getQuestionAnswerSummary', () => {
    const testBranchPath = fromJS([
      {
        ref: 'fruit',
        title: 'What is your favourite?',
        options: [
          { ref: 'apple', title: 'Apple pie', next: 'applepie', selected: true }
        ]
      },
      {
        ref: 'applepie',
        title: 'How do you like your apple?',
        options: [
          { ref: 'applepie', title: 'Apple pie', next: 'hotorcold', selected: true }
        ]
      },
      {
        ref: 'hotorcold',
        title: 'Hot or Cold?',
        options: [
          { ref: 'hot', title: 'Hot', next: 'cream', selected: true }
        ]
      }
    ])
    it('should return an array of summary details', () => {
      const summary = dtr.getQuestionAnswerSummary(testBranchPath, '')
      expect(summary.size).toBe(3)
      const keys = Object.keys(summary.get(0))
      expect(keys).toEqual(['key', 'value', 'actions'])
    })
  })
})
