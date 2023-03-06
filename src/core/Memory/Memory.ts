export interface IMemory<T> {
  read(): T
  write(value: T): void
  reset(): void
}

type Callback<Value> = (value: Value) => void
type Unsubscribe = () => void

export interface IReactiveMemory<T> extends IMemory<T> {
  onUpdate(callback: Callback<T>): Unsubscribe
  unsubscribeAll(): void
}

export function Memory<T>(): IMemory<T | undefined>
export function Memory<T>(defaultContent: T): IMemory<T>

export function Memory<T>(defaultContent?: T): IMemory<T | undefined> {
  let content = defaultContent

  return {
    read: () => content,
    write: (value) => (content = value),
    reset: () => (content = defaultContent),
  }
}

export function ReactiveMemory<T>(origin: IMemory<T>): IReactiveMemory<T> {
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
