import { LocalReactive } from './LocalReactive'
import { Reactive } from './Reactive'

describe('LocalReactive', () => {
  it('returns correct current', () => {
    const originalReactive = new Reactive(
      () => 100,
      () => () => {},
    )

    const localReactive = new LocalReactive(originalReactive)

    expect(localReactive.current()).toBe(100)
  })

  it('has correct onChange', () => {
    const callbacks = new Set<(value: number) => void>()

    let fakeState = 100

    function increaseFakeState() {
      fakeState += 100
      callbacks.forEach((callback) => callback(fakeState))
    }

    const originalReactive = new Reactive(
      () => fakeState,
      (callback) => {
        callbacks.add(callback)

        return () => callbacks.delete(callback)
      },
    )

    let valueFromOnChange: number | undefined

    const localReactive = new LocalReactive(originalReactive)

    localReactive.onChange((value) => (valueFromOnChange = value))

    expect(localReactive.current()).toBe(100)
    expect(valueFromOnChange).toBe(undefined)

    increaseFakeState()

    expect(localReactive.current()).toBe(200)
    expect(valueFromOnChange).toBe(200)
  })

  it('has correct unsubscribe', () => {
    const callbacks = new Set<(value: number) => void>()

    let fakeState = 100

    function increaseFakeState() {
      fakeState += 100
      callbacks.forEach((callback) => callback(fakeState))
    }

    const originalReactive = new Reactive(
      () => fakeState,
      (callback) => {
        callbacks.add(callback)

        return () => callbacks.delete(callback)
      },
    )

    let valueFromOnChange: number | undefined

    const localReactive = new LocalReactive(originalReactive)

    const unsubscribe = localReactive.onChange((value) => (valueFromOnChange = value))

    expect(localReactive.current()).toBe(100)
    expect(valueFromOnChange).toBe(undefined)

    unsubscribe()
    increaseFakeState()

    expect(localReactive.current()).toBe(200)
    expect(valueFromOnChange).toBe(undefined)
  })

  it('has correct unsubscribeAll', () => {
    const callbacks = new Set<(value: number) => void>()

    let fakeState = 100

    function increaseFakeState() {
      fakeState += 100
      callbacks.forEach((callback) => callback(fakeState))
    }

    const originalReactive = new Reactive(
      () => fakeState,
      (callback) => {
        callbacks.add(callback)

        return () => callbacks.delete(callback)
      },
    )

    let valueFromOnChange: number | undefined

    const localReactive = new LocalReactive(originalReactive)

    localReactive.onChange((value) => (valueFromOnChange = value))

    expect(localReactive.current()).toBe(100)
    expect(valueFromOnChange).toBe(undefined)

    localReactive.unsubscribeLocal()
    increaseFakeState()

    expect(localReactive.current()).toBe(200)
    expect(valueFromOnChange).toBe(undefined)
  })
})
