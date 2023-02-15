import autobind from './autobind'
import { IReactive, Reactive, Unsubscribe } from './Reactive'

@autobind
export class ReactiveFromReactive<T> implements IReactive<T> {
  constructor(private readonly origin: IReactive<T>) {}

  private readonly innerReactive = new Reactive(this.origin.current, this.origin.onChange)

  current(): T {
    return this.innerReactive.current()
  }

  onChange(callback: (value: T) => void): Unsubscribe {
    return this.innerReactive.onChange(callback)
  }
}
