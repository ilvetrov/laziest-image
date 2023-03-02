import { omitObject } from './omitObject'

describe('omitObject', () => {
  it('has properties', () => {
    const origin = { first: 111, second: 222, third: 333 }

    const rest = omitObject(origin, ['first'])

    expect(rest.second).toBe(222)
    expect(rest.third).toBe(333)
  })

  it('has no properties from origin', () => {
    const origin = { first: 111, second: 222, third: 333 }

    const rest = omitObject(origin, ['first'])

    expect((rest as any).first).toBe(undefined)
    expect(rest).toEqual({ second: 222, third: 333 })
  })
})
