import { UniqueDestroyers } from '../Destroyers/UniqueDestroyers'
import { IReactive } from './Reactive'

export function ReactiveMiddleware<T>(
  origin: IReactive<T>,
  middleCurrent: (value: T) => T,
  middleOnChange: (value: T) => T | Promise<T> = middleCurrent,
): IReactive<T> {
  return {
    current() {
      return middleCurrent(origin.current())
    },
    onChange(callback) {
      const destroyers = UniqueDestroyers()

      const onChangeDestroyer = origin.onChange(async (value) => {
        let destroyed = false

        destroyers.add('middleOnChange', () => (destroyed = true))

        const middlePromise = middleOnChange(value)
        const middleValue = middlePromise instanceof Promise ? await middlePromise : middlePromise

        if (destroyed) return

        callback(middleValue)
      })

      return () => {
        onChangeDestroyer()
        destroyers.destroyAll()
      }
    },
  }
}
