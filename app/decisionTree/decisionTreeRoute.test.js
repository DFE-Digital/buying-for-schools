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

  describe('validation of paths', () => {
    const tree = dt.makeTree([
      {
        ref: 'env',
        options: [
          { ref: 'farm', next: 'animals' },
          { ref: 'office', next: 'drinks' },
          { ref: 'home', next: 'housetypes' }
        ]
      },
      {
        ref: 'animals',
        options: [
          { ref: 'sheep', next: 'mutton' },
          { ref: 'pigs', next: 'pork' },
          { ref: 'bees', next: 'hive' }
        ]
      },
      {
        ref: 'drinks',
        options: [
          { ref: 'tea' },
          { ref: 'coffee', next: 'machine' },
          { ref: 'water' }
        ]
      },
      {
        ref: 'housetypes',
        options: [
          { ref: 'terraced' },
          { ref: 'semi' },
          { ref: 'detatched' }
        ]
      },
      {
        ref: 'mutton',
        options: [
          { ref: 'hotpot' },
          { ref: 'shepherds-pie' }
        ]
      },
      {
        ref: 'pork',
        options: [
          { ref: 'sausages', result: ['apple'] },
          { ref: 'bacon', result: ['apple', 'banana'] }
        ]
      },
      {
        ref: 'hive',
        options: [
          { ref: 'drone' },
          { ref: 'worker' },
          { ref: 'queen' }
        ]
      },
      {
        ref: 'machine',
        options: [
          { ref: 'instant' },
          { ref: 'aero-press' },
          { ref: 'filter' },
          { ref: 'cafetiere' }
        ]
      }
    ])
    const frameworks = dtres.makeFrameworks([
      { ref: 'apple' },
      { ref: 'banana' }
    ])
    const validUrls = [
      'env',
      'env/farm/animals/pigs/pork/bacon',
      'env/farm/animals/pigs/pork/',
      'env/farm/animals/pigs/pork',
      'env/farm/animals/pigs',
      'env/farm/',
      'env/office/drinks/tea',
      'env/home/housetypes/detatched',
      'env/home/housetypes',
      'env/farm/animals/pigs/pork/bacon/apple',
      'env/farm/animals/pigs/pork/bacon/banana',
      'env/farm/animals/pigs/pork/sausages/apple',

    ]

    const inValidUrls = [
      '/',
      'env/farm/drinks/tea',
      'env/office/animals/pigs/pork/',
      'env/office/animals/housetypes/pork',
      'env/home/animals/pigs',
      'env/home/drinks',
      'env/office/drinks/bacon',
      'env/home/pork/hotpot',
      'env/home/colour/blue',
      'env/farm/animals/pigs/pork/bacon/pear',
      'env/farm/animals/pigs/pork/bacon/appletise',
    ]
    describe('validateBranchPath', () => {
      describe('validate that the question answer pairs are possible', () => {
        validUrls.forEach(url => {
          it(`should pass ${url}`, () => {
            const pairs = dtr.getQuestionAnswerPairSlugs(url)
            expect(dtr.validateQuestionAnswerPairs(tree, pairs, frameworks)).toBeTruthy()
          })
        })
      })

      describe('validate that the question answer pairs are NOT possible', () => {
        inValidUrls.forEach(url => {
          it(`should NOT pass ${url}`, () => {
            const pairs = dtr.getQuestionAnswerPairSlugs(url)
            expect(dtr.validateQuestionAnswerPairs(tree, pairs)).toBeFalsy()
          })
        })
      })

      describe('getSanitisedQuestionAnswerPairs', () => {
        const sanitisedUrls = [
          ['', 'env'],
          ['/', 'env'],
          ['notapplicable', 'env'],
          ['env/farm/animals/pigs/pork/bacon', 'env/farm/animals/pigs/pork/bacon'],
          ['env/office/drinks/tea', 'env/office/drinks/tea'],
          ['env/office/drinks/', 'env/office/drinks'],
          ['env/farm/drinks/tea', 'env/farm'],
          ['env/office/animals/pigs/pork/', 'env/office'],
          ['env/office/animals/housetypes/pork', 'env/office'],
          ['env/home/animals/pigs', 'env/home'],
          ['env/home/drinks', 'env/home'],
          ['env/office/drinks/bacon', 'env/office/drinks'],
          ['env/home/pork/hotpot', 'env/home'],
          ['env/home/colour/blue', 'env/home']
        ]
        sanitisedUrls.forEach(urls => {
          const suspectUrl = urls[0]
          const sanitisedUrl = urls[1]
          it(`should sanitise ${suspectUrl} into ${sanitisedUrl}`, () => {
            const suspectPairs = dtr.getQuestionAnswerPairSlugs(suspectUrl)
            const cleanPairs = dtr.getSanitisedQuestionAnswerPairs(tree, suspectPairs)
            expect(is(cleanPairs, dtr.getQuestionAnswerPairSlugs(sanitisedUrl)))
          })
        })
      })
    })
  })

  describe('getUrlFromPairs', () => {
    it('should be able to take pairs and convert to a Url', () => {
      const pairs = Map({ env: 'farm', 'animals': 'sheep', 'mutton': 'hotpot' })
      expect(dtr.getUrlFromPairs(pairs)).toBe('env/farm/animals/sheep/mutton/hotpot')
    })

    it('should be able to take pairs with an answer undefined and convert to a Url', () => {
      const pairs = Map({ env: 'farm', 'animals': 'sheep', 'mutton': undefined })
      expect(dtr.getUrlFromPairs(pairs)).toBe('env/farm/animals/sheep/mutton')
    })
  })
})
