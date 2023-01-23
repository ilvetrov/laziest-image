import { IReactive, Unsubscribe } from './Reactive'

export class ReactiveWithUpdateOnSubscribe<T> implements IReactive<T> {
  constructor(private readonly origin: IReactive<T>) {}

  current(): T {
    return this.origin.current()
  }

  onChange(callback: (value: T) => void): Unsubscribe {
    callback(this.current())

    return this.origin.onChange(callback)
  }
}
