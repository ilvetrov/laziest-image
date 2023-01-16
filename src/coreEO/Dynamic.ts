type Getter<T> = () => T
type Subscribe<T> = (callback: (value: T, lastValue: T) => void) => Unsubscribe
type Setter<T> = (value: T | ((lastValue: T) => T)) => void
type Unsubscribe = () => void

export interface IDynamic<T> {
  get: Getter<T>
  set: Setter<T>
  subscribe: Subscribe<T>
  destroy(): void
}

export class Dynamic<T> implements IDynamic<T> {
  constructor(private readonly origin: IDynamic<T>) {}

  private destroyed = false

  get() {
    return this.origin.get()
  }

  set(value: T | ((lastValue: T) => T)) {
    if (this.destroyed) {
      return
    }

    this.origin.set(value)
  }

  private readonly subscriberDestroyers = new Set<() => void>()

  subscribe(callback: (value: T, lastValue: T) => void): Unsubscribe {
    if (this.destroyed) {
      return () => {}
    }

    const destroyer = this.origin.subscribe(callback)

    this.subscriberDestroyers.add(destroyer)

    return destroyer
  }

  destroy() {
    this.destroyed = true
    this.subscriberDestroyers.forEach((destroyer) => destroyer())
    this.origin.destroy()
  }
}
