import { LocalSyncState } from 'local-sync-state'
import { IControlledReactive, Unsubscribe } from './ControlledReactive'

export class ControlledReactiveFromLocalSyncState<T> implements IControlledReactive<T> {
  constructor(private readonly localSyncState: LocalSyncState<T>) {}

  current(): T {
    return this.localSyncState.get()
  }

  onChange(callback: (value: T) => void): Unsubscribe {
    return this.localSyncState.onUpdate(callback)
  }

  changeValue(value: T): void {
    this.localSyncState.set(value)
  }

  unsubscribeAll(): void {
    this.localSyncState.destroy()
  }
}
