export type Unsubscribe = () => void

export interface IReactive<T> {
  current(): T
  onChange(callback: (value: T) => void): Unsubscribe
}

export class Reactive<T> implements IReactive<T> {
  constructor(
    private readonly getValue: () => T,
    private readonly subscribeOnValue: (callback: (value: T) => void) => Unsubscribe,
  ) {}

  current(): T {
    return this.getValue()
  }

  onChange(callback: (value: T) => void): Unsubscribe {
    return this.subscribeOnValue(callback)
  }
}
