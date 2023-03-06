import { Memory, ReactiveMemory } from './Memory'

describe('Memory', () => {
  it('keeps data', () => {
    const number = Memory(0)

    expect(number.read()).toBe(0)
  })

  it('can write', () => {
    const number = Memory(0)

    number.write(1)

    expect(number.read()).toBe(1)
  })

  it('can reset', () => {
    const number = Memory(0)

    number.write(1)
    number.reset()

    expect(number.read()).toBe(0)
  })
})

describe('ReactiveMemory', () => {
  it('can write', () => {
    const number = ReactiveMemory(Memory(0))

    number.write(1)

    expect(number.read()).toBe(1)
  })

  it('can subscribe', () => {
    const number = ReactiveMemory(Memory(0))

    let calledNumber = 0

    number.onUpdate((newValue) => (calledNumber = newValue))
    number.write(1)

    expect(calledNumber).toBe(1)
  })

  it('can unsubscribe', () => {
    const number = ReactiveMemory(Memory(0))

    let calledNumber = 0

    number.onUpdate((newValue) => (calledNumber = newValue))
    number.unsubscribeAll()
    number.write(1)

    expect(calledNumber).toBe(0)
  })
})
