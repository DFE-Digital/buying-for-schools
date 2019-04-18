/* global describe it expect */
/* global Map:true */


const dtr = require('./decisionTreeRoute')
const dtres = require('./decisionTreeResults')

describe('decisionTreeRoute', () => {
  describe('getQuestionAnswerPairSlugs', () => {
    it('should separate url paths into pairs of question and answer slugs', () => {
      const fruits = dtr.getQuestionAnswerPairSlugs('a/apple/b/banana/c/cherry')
      expect(fruits).toEqual({
        a: 'apple',
        b: 'banana',
        c: 'cherry'
      })

      const music = dtr.getQuestionAnswerPairSlugs('band/queen/album/night-at-opera/song/')
      expect(music).toEqual({
        band: 'queen',
        album: 'night-at-opera',
        song: undefined
      })

      const qa = dtr.getQuestionAnswerPairSlugs('/q1/a1/q2/')
      expect(qa).toEqual({
        q1: 'a1',
        q2: undefined
      })

      const slashed = dtr.getQuestionAnswerPairSlugs('/type/')
      expect(slashed).toEqual({
        type: undefined
      })

      const blankSlash = dtr.getQuestionAnswerPairSlugs('/') 
      expect(blankSlash).toEqual({})
    })
  })
})
