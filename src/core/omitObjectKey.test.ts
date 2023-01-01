import omitObjectKeys from './omitObjectKeys'

describe('omitObjectKeys', () => {
  it('removes key', () => {
    const inputObject = { a: 1, b: '2', c: 3 }
    const outputObject = { a: 1, c: 3 }

    const testingObject = omitObjectKeys(inputObject, ['b'])

    expect(testingObject).toEqual(outputObject)
  })

  it('removes keys', () => {
    const inputObject = { a: 1, b: 2, c: 3 }
    const outputObject = { a: 1 }

    const testingObject = omitObjectKeys(inputObject, ['b', 'c'])

    expect(testingObject).toEqual(outputObject)
  })

  it("won't fall without keys", () => {
    const inputObject = { a: 1, b: 2, c: 3 }
    const outputObject = { a: 1, b: 2, c: 3 }

    const testingObject = omitObjectKeys(inputObject, [])

    expect(testingObject).toEqual(outputObject)
  })

  it('removes symbols', () => {
    const symbol1 = Symbol('test')
    const symbol2 = Symbol('test')
    const inputObject = { a: 1, [symbol1]: 2, [symbol2]: 3 }
    const outputObject = { a: 1, [symbol1]: 2 }

    const testingObject = omitObjectKeys(inputObject, [symbol2])

    expect(testingObject).toEqual(outputObject)
  })

  it('removes symbols and strings', () => {
    const symbol1 = Symbol('test')
    const symbol2 = Symbol('test')
    const inputObject = { a: 1, b: 2, [symbol1]: 2, [symbol2]: 3 }
    const outputObject = { a: 1, [symbol1]: 2 }

    const testingObject = omitObjectKeys(inputObject, ['b', symbol2])

    expect(testingObject).toEqual(outputObject)
  })
})
