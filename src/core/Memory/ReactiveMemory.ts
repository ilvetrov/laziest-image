import { IMemory } from './Memory'

type Callback<Value> = (value: Value) => void
type Unsubscribe = () => void

export interface IReactiveMemory extends IMemory {
  onUpdate(callback: Callback<IMemory>): Unsubscribe
  unsubscribeAll(): void
}

export function ReactiveMemory(origin: IMemory): IReactiveMemory {
  const callbacks = new Set<Callback<IMemory>>()

  return {
    ...origin,

    write(key, value) {
      origin.write(key, value)

      callbacks.forEach((callback) => callback(origin))
    },

    onUpdate(callback) {
      callbacks.add(callback)

      return () => callbacks.delete(callback)
    },

    unsubscribeAll: () => callbacks.clear(),
  }
}
