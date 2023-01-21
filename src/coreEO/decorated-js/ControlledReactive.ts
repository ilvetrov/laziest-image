export type Unsubscribe = () => void

export interface IControlledReactive<T> {
  current(): T
  onChange(callback: (value: T) => void): Unsubscribe
  changeValue(value: T): void
  unsubscribeAll(): void
}

export class ControlledReactive<T> implements IControlledReactive<T> {
  constructor(
    private readonly getValue: () => T,
    private readonly subscribeOnValue: (callback: (value: T) => void) => Unsubscribe,
    private readonly changeValueInOrigin: (value: T) => void,
    private readonly unsubscribeAllInOrigin: () => void,
  ) {}

  current(): T {
    return this.getValue()
  }

  onChange(callback: (value: T) => void): Unsubscribe {
    return this.subscribeOnValue(callback)
  }

  changeValue(value: T): void {
    this.changeValueInOrigin(value)
  }

  unsubscribeAll(): void {
    this.unsubscribeAllInOrigin()
  }
}
