import localSyncState from 'local-sync-state'
import { IControlledReactive, Unsubscribe } from './ControlledReactive'
import { ControlledReactiveFromLocalSyncState } from './ControlledReactiveFromLocalSyncState'
import once from './onceMethod'
import { IReactive } from './Reactive'

export class ControlledReactiveFromPlain<T> implements IControlledReactive<T> {
  constructor(
    private readonly origin: IReactive<T>,
    private readonly controlledFabric?: () => IControlledReactive<T>,
  ) {}

  @once
  private controlled(): IControlledReactive<T> {
    const controlled = this.controlledFabric
      ? this.controlledFabric()
      : new ControlledReactiveFromLocalSyncState(localSyncState(this.origin.current()))

    this.origin.onChange((newValue) => controlled.changeValue(newValue))

    return controlled
  }

  current(): T {
    return this.controlled().current()
  }

  onChange(callback: (value: T) => void): Unsubscribe {
    return this.controlled().onChange(callback)
  }

  changeValue(value: T): void {
    this.controlled().changeValue(value)
  }

  unsubscribeAll(): void {
    this.controlled().unsubscribeAll()
  }
}
