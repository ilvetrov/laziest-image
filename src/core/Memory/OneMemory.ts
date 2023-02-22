export interface IOneMemory<T> {
  read(): T
  write(value: T): void
  reset(): void
}

type Callback<Value> = (value: Value) => void
type Unsubscribe = () => void

export interface IReactiveOneMemory<T> extends IOneMemory<T> {
  onUpdate(callback: Callback<T>): Unsubscribe
  unsubscribeAll(): void
}

export function OneMemory<T>(): IOneMemory<T | undefined>
export function OneMemory<T>(defaultContent: T): IOneMemory<T>

export function OneMemory<T>(defaultContent?: T): IOneMemory<T | undefined> {
  let content = defaultContent

  return {
    read: () => content,
    write: (value) => (content = value),
    reset: () => (content = defaultContent),
  }
}

export function ReactiveOneMemory<T>(origin: IOneMemory<T>): IReactiveOneMemory<T> {
  const callbacks = new Set<Callback<T>>()

  return {
    read: origin.read,
    reset: origin.reset,

    write(value) {
      origin.write(value)

      callbacks.forEach((callback) => callback(origin.read()))
    },

    onUpdate(callback) {
      callbacks.add(callback)

      return () => callbacks.delete(callback)
    },

    unsubscribeAll: () => callbacks.clear(),
  }
}
