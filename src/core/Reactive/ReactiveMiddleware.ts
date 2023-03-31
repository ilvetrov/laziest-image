import { Destroyer, Destroyers } from '../Destroyers/Destroyers'
import { UniqueDestroyers } from '../Destroyers/UniqueDestroyers'
import { OptionalCallback } from '../Optional/OptionalCallback'
import { IReactive } from './Reactive'

export function ReactiveMiddleware<T>(
  origin: () => IReactive<T>,
  middleCurrent: (value: T) => T,
  middleOnChange?: (value: T, changeValue: (value: T) => void) => Destroyer | void,
): () => IReactive<T> {
  return () => ({
    current() {
      return middleCurrent(origin().current())
    },
    onChange(callback) {
      const destroyers = UniqueDestroyers()

      destroyers.add(
        'originOnChange',
        origin().onChange(async (value) => {
          let destroyed = false

          destroyers.add('middleOnChange', () => (destroyed = true))

          const middleDestroyers = Destroyers()

          destroyers.add('middleDestroyers', () => middleDestroyers.destroyAll())

          if (middleOnChange) {
            middleDestroyers.add(
              OptionalCallback(
                middleOnChange(value, (result) => {
                  if (destroyed) return

                  callback(result)
                }),
              ),
            )
          } else {
            callback(middleCurrent(value))
          }
        }),
      )

      return () => {
        destroyers.destroyAll()
      }
    },
  })
}
