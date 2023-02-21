import { mapObject } from './mapObject'

describe('mapObject', () => {
  it('works', () => {
    const inputObject = { first: 1, second: 2, third: 3 }
    const outputObject = { first: '2', second: '3', third: '4' }

    const testingObject = mapObject(inputObject, (number) => String(number + 1))

    expect(testingObject).toEqual(outputObject)
  })
})
