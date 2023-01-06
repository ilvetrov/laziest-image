import checkVisibility from './checkVisibility'

describe('checkVisibility', () => {
  it('element without width and height returns false', () => {
    const element = document.createElement('div')

    element.getBoundingClientRect = jest.fn(() => ({
      y: 0,
      x: 0,
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      toJSON: jest.fn(),
    }))

    expect(checkVisibility(element)).toBe(false)
  })

  it('element with width and height returns true', () => {
    const element = document.createElement('div')

    element.getBoundingClientRect = jest.fn(() => ({
      y: 0,
      x: 0,
      width: 10,
      height: 10,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      toJSON: jest.fn(),
    }))

    expect(checkVisibility(element, 0, 0)).toBe(true)
  })

  it('y outside of window returns false if yOffset is 0', () => {
    const element = document.createElement('div')

    element.getBoundingClientRect = jest.fn(() => ({
      y: window.innerHeight + 1,
      x: 0,
      width: 10,
      height: 10,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      toJSON: jest.fn(),
    }))

    expect(checkVisibility(element, 0, 0)).toBe(false)
  })

  it('x outside of window returns false if xOffset is 0', () => {
    const element = document.createElement('div')

    element.getBoundingClientRect = jest.fn(() => ({
      y: 0,
      x: window.innerWidth + 1,
      width: 10,
      height: 10,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      toJSON: jest.fn(),
    }))

    expect(checkVisibility(element, 0, 0)).toBe(false)
  })

  it('x outside of window returns true if xOffset is "any"', () => {
    const element = document.createElement('div')

    element.getBoundingClientRect = jest.fn(() => ({
      y: 0,
      x: window.innerWidth + 1,
      width: 10,
      height: 10,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      toJSON: jest.fn(),
    }))

    expect(checkVisibility(element, 0, 'any')).toBe(true)
  })

  it('y inside window returns true if yOffset is outside of window but near', () => {
    const element = document.createElement('div')

    element.getBoundingClientRect = jest.fn(() => ({
      y: window.innerHeight * 1.5,
      x: 0,
      width: 10,
      height: 10,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      toJSON: jest.fn(),
    }))

    expect(checkVisibility(element, window.innerHeight / 2, 0)).toBe(true)
  })

  it('y inside window returns false if y is too far adove', () => {
    const element = document.createElement('div')

    element.getBoundingClientRect = jest.fn(() => ({
      y: -100,
      x: 0,
      width: 10,
      height: 100,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      toJSON: jest.fn(),
    }))

    expect(checkVisibility(element, 0, 0)).toBe(false)
  })

  it('y inside window returns true if y is far adove, but yOffset is compensates', () => {
    const element = document.createElement('div')

    element.getBoundingClientRect = jest.fn(() => ({
      y: -100,
      x: 0,
      width: 10,
      height: 100,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      toJSON: jest.fn(),
    }))

    expect(checkVisibility(element, 1, 0)).toBe(true)
  })

  it('x inside window returns false if x is too far left', () => {
    const element = document.createElement('div')

    element.getBoundingClientRect = jest.fn(() => ({
      y: 0,
      x: -100,
      width: 100,
      height: 10,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      toJSON: jest.fn(),
    }))

    expect(checkVisibility(element, 0, 0)).toBe(false)
  })

  it('x inside window returns true if x is far left, but xOffset is compensates', () => {
    const element = document.createElement('div')

    element.getBoundingClientRect = jest.fn(() => ({
      y: 0,
      x: -100,
      width: 100,
      height: 10,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      toJSON: jest.fn(),
    }))

    expect(checkVisibility(element, 0, 1)).toBe(true)
  })
})
