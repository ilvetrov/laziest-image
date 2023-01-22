import once from './onceMethod'
import { IReactive, Reactive, Unsubscribe } from './Reactive'

export class ReactiveFromReactive<T> implements IReactive<T> {
  constructor(private readonly origin: IReactive<T>) {}

  @once
  private get innerReactive(): IReactive<T> {
    return new Reactive(this.origin.current, this.origin.onChange)
  }

  current(): T {
    return this.innerReactive.current()
  }

  onChange(callback: (value: T) => void): Unsubscribe {
    return this.innerReactive.onChange(callback)
  }
}
