import { IDynamic } from './Dynamic'

export type IReadOnlyDynamic<T> = Omit<IDynamic<T>, 'set'>

export class ReadOnlyDynamic<T> implements IReadOnlyDynamic<T> {
  constructor(private readonly origin: IDynamic<T> | IReadOnlyDynamic<T>) {}

  get() {
    return this.origin.get()
  }

  subscribe(callback: (value: T, lastValue: T) => void) {
    return this.origin.subscribe(callback)
  }

  destroy() {
    this.origin.destroy()
  }
}
