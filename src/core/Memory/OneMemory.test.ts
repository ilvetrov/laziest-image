import { OneMemory, ReactiveOneMemory } from './OneMemory'

describe('OneMemory', () => {
  it('keeps data', () => {
    const number = OneMemory(0)

    expect(number.read()).toBe(0)
  })

  it('can write', () => {
    const number = OneMemory(0)

    number.write(1)

    expect(number.read()).toBe(1)
  })

  it('can reset', () => {
    const number = OneMemory(0)

    number.write(1)
    number.reset()

    expect(number.read()).toBe(0)
  })
})

describe('ReactiveOneMemory', () => {
  it('can write', () => {
    const number = ReactiveOneMemory(OneMemory(0))

    number.write(1)

    expect(number.read()).toBe(1)
  })

  it('can subscribe', () => {
    const number = ReactiveOneMemory(OneMemory(0))

    let calledNumber = 0

    number.onUpdate((newValue) => (calledNumber = newValue))
    number.write(1)

    expect(calledNumber).toBe(1)
  })

  it('can unsubscribe', () => {
    const number = ReactiveOneMemory(OneMemory(0))

    let calledNumber = 0

    number.onUpdate((newValue) => (calledNumber = newValue))
    number.unsubscribeAll()
    number.write(1)

    expect(calledNumber).toBe(0)
  })
})
