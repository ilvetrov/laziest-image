import { LocalSyncState } from 'local-sync-state'
import { IDynamic } from './Dynamic'

export default class DynamicFromLocalSyncState<T> implements IDynamic<T> {
  constructor(private readonly state: LocalSyncState<T>) {}

  get(): T {
    return this.state.get()
  }

  set(value: T | ((lastValue: T) => T)) {
    this.state.set(value)
  }

  subscribe(callback: (value: T, lastValue: T) => void): () => void {
    return this.state.onUpdate(callback)
  }

  destroy() {
    this.state.destroy()
  }
}
