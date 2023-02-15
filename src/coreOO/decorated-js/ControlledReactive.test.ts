import { ControlledReactive } from './ControlledReactive'

describe('ControlledReactive', () => {
  it('is under control', () => {
    let fakeState = 100

    const callbacks = new Set<(value: number) => void>()

    function changeFakeState(newValue: number) {
      fakeState = newValue
      callbacks.forEach((callback) => callback(fakeState))
    }

    const controlled = new ControlledReactive(
      () => fakeState,
      (callback) => {
        callbacks.add(callback)

        return () => callbacks.delete(callback)
      },
      changeFakeState,
      () => callbacks.clear(),
    )

    expect(controlled.current()).toBe(100)

    let valueFromOnChange: number | undefined

    controlled.onChange((newValue) => (valueFromOnChange = newValue))

    expect(valueFromOnChange).toBe(undefined)

    controlled.changeValue(200)

    expect(controlled.current()).toBe(200)
    expect(valueFromOnChange).toBe(200)

    controlled.unsubscribeAll()
    controlled.changeValue(300)

    expect(controlled.current()).toBe(300)
    expect(valueFromOnChange).toBe(200)
  })
})
