import { IReactive } from './Reactive'

export type Unsubscribe = () => void

export interface ILocalReactive<T> {
  current(): T
  onChange(callback: (value: T) => void): Unsubscribe
  unsubscribe(): void
}

export function LocalReactive<T>(origin: IReactive<T>): ILocalReactive<T> {
  const unsubscribers = new Set<Unsubscribe>()

  return {
    current: origin.current,
    onChange(callback) {
      const unsubscribe = origin.onChange(callback)

      unsubscribers.add(unsubscribe)

      return unsubscribe
    },
    unsubscribe() {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
      unsubscribers.clear()
    },
  }
}
