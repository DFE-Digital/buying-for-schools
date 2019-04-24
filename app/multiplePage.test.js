/* global describe it expect jest */
const nunjucks = require('nunjucks')
const multiplePage = require('./multiplePage')
const testTreeData = [
  {
    ref: 'a',
    title: 'A',
    options: [
      {
        ref: 'b',
        title: 'B',
        result: [
          'c',
          'd'
        ]
      },
      {
        ref: 'e'
      },
      {
        ref: 'f',
        result: ['c', 'z']
      }
    ]
  }
]
const testTree = require('./decisionTree/tree')(testTreeData)

const testResultData = [
  {
    "ref": "c",
    "title": "C",
    "supplier": "supplier-C",
    "url": "https://www.c.com",
    "cat": "cat-C"
  },
  {
    "ref": "d",
    "title": "D",
    "supplier": "supplier-D",
    "url": "https://www.d.com",
    "cat": "cat-D"
  }
]
const testFrameworks = require('./decisionTree/frameworks')(testResultData)

const lastNunjucksRender = { tpl: '', params: null }
nunjucks.render = jest.fn((tpl, params) => {
  lastNunjucksRender.tpl = tpl,
  lastNunjucksRender.params = params
})

describe('multiplePage', () => {
  it('should return a function when passed an app parameter', () => {
    const app = {}
    const mp = multiplePage(app)
    expect(typeof mp).toBe('function')
  })

  describe('calling nunjucks.render', () => {
    const app = { locals: { tree: testTree, serviceName: '', frameworks: testFrameworks, frameworkPath: '' }}
    const res = { locals: { urlBits: ['a', 'b'], urlInfo: {}, summary: {} }, send: jest.fn() }
    const mp = multiplePage(app)
    const req = { url: 'a/b'}
    it('should be trying to render results.njk', () => {
      mp(req, res)
      expect(lastNunjucksRender.tpl).toEqual('results.njk')
    })

    it('should pass results to tpl', () => {
      mp(req, res)

      const resultC = lastNunjucksRender.params.resultList.find(r => r.ref === 'c')
      const resultD = lastNunjucksRender.params.resultList.find(r => r.ref === 'd')

      expect(lastNunjucksRender.params.resultList.length).toEqual(2)
      expect(resultC.ref).toEqual('c')
      expect(resultD.ref).toEqual('d')

      expect(resultC.nextUrl = 'a/b/c')
      expect(resultD.nextUrl = 'a/b/d')
    })
  })

  describe('should call next() if an error occurs', () => {
    const app = { locals: { tree: testTree, serviceName: '', frameworks: testFrameworks, frameworkPath: '' }}
    const mp = multiplePage(app)

    it('branch doest not exist ', () => {
      const res = { locals: { urlBits: ['x', 'e'], urlInfo: {}, summary: {} }, send: jest.fn() }  
      const req = { url: 'x/e'}
      const nxt = jest.fn()
      mp(req, res, nxt)

      expect(nxt).toBeCalled()
    })

    it('answer doest not exist ', () => {
      const res = { locals: { urlBits: ['a', 'z'], urlInfo: {}, summary: {} }, send: jest.fn() }  
      const req = { url: 'a/z'}
      const nxt = jest.fn()
      mp(req, res, nxt)

      expect(nxt).toBeCalled()
    })

    it('no results', () => {
      const res = { locals: { urlBits: ['a', 'e'], urlInfo: {}, summary: {} }, send: jest.fn() }  
      const req = { url: 'a/e'}
      const nxt = jest.fn()
      mp(req, res, nxt)

      expect(nxt).toBeCalled()
    })

    it('result does not exist', () => {
      const res = { locals: { urlBits: ['a', 'f'], urlInfo: {}, summary: {} }, send: jest.fn() }  
      const req = { url: 'a/f'}
      const nxt = jest.fn()
      mp(req, res, nxt)

      expect(nxt).toBeCalled()
    })
  })
})