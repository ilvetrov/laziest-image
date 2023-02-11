import { Destroyers } from './Destroyers'

describe('Destroyers', () => {
  it('destroys correctly', () => {
    const destroyers = new Destroyers()

    let destroyed = false

    destroyers.add(() => (destroyed = true))

    destroyers.destroyAll()

    expect(destroyed).toBe(true)
  })

  it('does not destroy', () => {
    const destroyers = new Destroyers()

    let destroyed = false

    destroyers.add(() => (destroyed = true))

    expect(destroyed).toBe(false)
  })

  it('looses this', () => {
    const destroyers = new Destroyers()

    let destroyed = false

    function thirdExampleFunc(onDestroy: (callback: () => void) => void) {
      onDestroy(() => (destroyed = true))
    }

    expect(() => thirdExampleFunc(destroyers.add)).toThrowError()
    expect(destroyed).toBe(false)
  })
})
