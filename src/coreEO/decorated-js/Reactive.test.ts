import { Reactive } from './Reactive'

describe('Reactive', () => {
  it('returns correct current', () => {
    const reactive = new Reactive(
      () => 100,
      () => () => {},
    )

    expect(reactive.current()).toBe(100)
  })

  it('returns correct on change', () => {
    let increaseValueInState: (() => void) | undefined

    let fakeState = 100

    const reactive = new Reactive(
      () => fakeState,
      (callback) => {
        increaseValueInState = () => {
          fakeState += 100
          callback(fakeState)
        }

        return () => {}
      },
    )

    let valueFromOnChange: number | undefined

    reactive.onChange((newValue) => (valueFromOnChange = newValue))

    increaseValueInState!()

    expect(reactive.current()).toBe(200)
    expect(valueFromOnChange).toBe(200)
  })

  it('has correct unsubscribe', () => {
    let increaseValueInState: (() => void) | undefined

    let fakeState = 100

    const reactive = new Reactive(
      () => fakeState,
      (callback) => {
        let canRunCallback = true

        increaseValueInState = () => {
          fakeState += 100

          if (canRunCallback) {
            callback(fakeState)
          }
        }

        return () => {
          canRunCallback = false
        }
      },
    )

    let valueFromOnChange: number | undefined

    const unsubcsribe = reactive.onChange((newValue) => (valueFromOnChange = newValue))

    increaseValueInState!()

    unsubcsribe()

    increaseValueInState!()

    expect(reactive.current()).toBe(300)
    expect(valueFromOnChange).toBe(200)
  })
})
