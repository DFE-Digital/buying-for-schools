/* global describe it expect jest */

const path = require('path')
const nunjucks = require('nunjucks')
const dealsPage = require('./dealsPage')

const { routeDealsPage, allDealsPage, dealPage } = dealsPage

const frameworkFrame = require('./decisionTree/frameworks')
const testFrameworkData = require(path.resolve(__dirname, './data/mocks/animals/animal-frameworks.json'))
const frameworks = frameworkFrame.makeFrameworks(testFrameworkData)
const categories = require('./data/mocks/animals/animal-categories.json')

const lastNunjucksRender = { tpl: '', params: null }
nunjucks.render = jest.fn((tpl, params) => {
  lastNunjucksRender.tpl = tpl,
  lastNunjucksRender.params = params
})

describe('routeDealsPage', () => {
  const mockCalls = []
  const app = {
    get: (path, callback) => {
      // console.log(path)
      mockCalls.push(path)
    },
    locals: {
      frameworks,
      categories
    }
  }
  it('should create an all deals list page entry in the app', () => {
    routeDealsPage(app)
    expect(mockCalls[0]).toBe('/framework')
  })
  frameworks.getAll().forEach(f => {
    const ref = f.getRef()
    it(`should create a deal page for each framework: ${ref}`, () => {
      expect(mockCalls).toContain(`/framework/${ref}`)  
    })  
  })
})

describe('allDealsPage', () => {
  const app = {
    locals: {
      frameworks,
      categories
    }
  }
  const allDealsPageFn = allDealsPage(app)
  const req = jest.fn()
  const res = { send: jest.fn()}
  

  it('should return a function', () => {
    expect(typeof allDealsPageFn).toBe('function')
  })

  it('should try to render deals.njk', () => {
    allDealsPageFn(req, res)
    expect(lastNunjucksRender.tpl).toBe('deals.njk')
  })

  it('should have "Framework list" as a pageTitle', () => {
    allDealsPageFn(req, res)
    expect(lastNunjucksRender.params.pageTitle).toBe('Framework list')
  })
})

describe('dealPage', () => {
  const beetles = frameworks.get('beetles')
  const app = {
    locals: {
      frameworks,
      categories
    }
  }
  const dealPageFn = dealPage(app, beetles)
  const req = jest.fn()
  const res = { send: jest.fn()}
  

  it('should return a function', () => {
    expect(typeof dealPageFn).toBe('function')
  })

  it('should try to render deals.njk', () => {
    dealPageFn(req, res)
    expect(lastNunjucksRender.tpl).toBe('frameworks/beetles.njk')
  })

  it('should have "Beetles" as a pageTitle', () => {
    dealPageFn(req, res)
    expect(lastNunjucksRender.params.pageTitle).toBe('Beetles')
  })

  it('should have the correct result ref', () => {
    dealPageFn(req, res)
    expect(lastNunjucksRender.params.result).toBe('beetles')
  })

  it('should have the result framework as an object', () => {
    dealPageFn(req, res)
    expect(lastNunjucksRender.params.resultMeta).toEqual(beetles.toObject())
  })
})