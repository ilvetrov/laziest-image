import autobind from './autobind'
import { IReactive } from './Reactive'

export type Unsubscribe = () => void

export interface ILocalReactive<T> {
  current(): T
  onChange(callback: (value: T) => void): Unsubscribe
  unsubscribeLocal(): void
}

@autobind
export class LocalReactive<T> implements ILocalReactive<T> {
  constructor(private readonly origin: IReactive<T>) {}

  private readonly subscribers = new Set<Unsubscribe>()

  private destroyed = false

  current(): T {
    return this.origin.current()
  }

  onChange(callback: (value: T) => void): Unsubscribe {
    if (this.destroyed) {
      throw new Error('localReactive was destroyed')
    }

    const destroyer = this.origin.onChange(callback)

    this.subscribers.add(destroyer)

    return destroyer
  }

  unsubscribeLocal(): void {
    this.destroyed = true
    this.subscribers.forEach((destroyer) => destroyer())
    this.subscribers.clear()
  }
}
