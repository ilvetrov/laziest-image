import { ModulePool } from './ModulePool'

interface IBiggerThanNumber {
  get(): number
  biggerThan(number: number): boolean
}

function BiggerThanNumber(number: number): IBiggerThanNumber {
  return {
    get: () => number,
    biggerThan: (numberToCompare) => number > numberToCompare,
  }
}

function BiggerThanNumberOrEqual(origin: IBiggerThanNumber): IBiggerThanNumber {
  return {
    get: origin.get,
    biggerThan: (numberToCompare) =>
      origin.biggerThan(numberToCompare) || origin.get() === numberToCompare,
  }
}

function BiggerThanNumberOrUser(origin: IBiggerThanNumber, userNumber: number): IBiggerThanNumber {
  return {
    get: origin.get,
    biggerThan: (numberToCompare) =>
      origin.biggerThan(numberToCompare) || origin.get() === userNumber,
  }
}

describe('ModulePool', () => {
  it('works', () => {
    const numberPool = ModulePool(
      { year: 365, week: 7, day: 1 },
      { BiggerThanNumber, BiggerThanNumberOrEqual, BiggerThanNumberOrUser },
    )

    const myNumber = (number: number, useDecorators = true) =>
      numberPool.fill(
        // eslint-disable-next-line @typescript-eslint/no-shadow
        (environment, { BiggerThanNumber, BiggerThanNumberOrEqual, BiggerThanNumberOrUser }) => {
          return BiggerThanNumberOrUser(
            BiggerThanNumberOrEqual(BiggerThanNumber(number), useDecorators),
            useDecorators,
            environment.year,
          )
        },
      )

    // Without decorators
    expect(myNumber(7, false).biggerThan(1)).toBe(true)
    expect(myNumber(7, false).biggerThan(7)).toBe(false)
    expect(myNumber(365, false).biggerThan(370)).toBe(false)

    // With crazy decorators
    expect(myNumber(7).biggerThan(1)).toBe(true)
    expect(myNumber(7).biggerThan(7)).toBe(true)
    expect(myNumber(365).biggerThan(370)).toBe(true)
  })
})
