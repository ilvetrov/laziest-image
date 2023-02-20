import { Destroyers } from '../Destroyers/Destroyers'
import { UniqueDestroyers } from '../Destroyers/UniqueDestroyers'
import { IReactive } from './Reactive'

export function ReactiveMiddleware<T>(
  origin: IReactive<T>,
  middleCurrent: (value: T) => T,
  middleOnChange: (
    value: T,
    onDestroy: (callback: () => void) => void,
  ) => T | Promise<T> = middleCurrent,
): IReactive<T> {
  return {
    current() {
      return middleCurrent(origin.current())
    },
    onChange(callback) {
      const destroyers = UniqueDestroyers()

      destroyers.add(
        'originOnChange',
        origin.onChange(async (value) => {
          let destroyed = false

          destroyers.add('middleOnChange', () => (destroyed = true))

          const middleDestroyers = Destroyers()

          destroyers.add('middleDestroyers', () => middleDestroyers.destroyAll())

          const middlePromise = middleOnChange(value, middleDestroyers.add)
          const middleValue = middlePromise instanceof Promise ? await middlePromise : middlePromise

          if (destroyed) return

          callback(middleValue)
        }),
      )

      return () => {
        destroyers.destroyAll()
      }
    },
  }
}
