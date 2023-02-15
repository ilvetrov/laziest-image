import localSyncState from 'local-sync-state'
import autobind from './autobind'
import { IControlledReactive, Unsubscribe } from './ControlledReactive'
import { ControlledReactiveFromLocalSyncState } from './ControlledReactiveFromLocalSyncState'
import once from './onceMethod'
import { IReactive } from './Reactive'

@autobind
export class ControlledReactiveFromPlain<T> implements IControlledReactive<T> {
  constructor(private readonly origin: IReactive<T>) {}

  @once
  private get controlled(): IControlledReactive<T> {
    const controlled = new ControlledReactiveFromLocalSyncState(
      localSyncState(this.origin.current()),
    )

    this.origin.onChange((newValue) => controlled.changeValue(newValue))

    return controlled
  }

  current(): T {
    return this.controlled.current()
  }

  onChange(callback: (value: T) => void): Unsubscribe {
    return this.controlled.onChange(callback)
  }

  changeValue(value: T): void {
    this.controlled.changeValue(value)
  }

  unsubscribeAll(): void {
    this.controlled.unsubscribeAll()
  }
}
