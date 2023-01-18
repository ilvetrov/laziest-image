import { LocalSyncState } from 'local-sync-state'
import cached from './cached'
import { Dynamic, IDynamic } from './Dynamic'

export default class DynamicFromLocalSyncState<T> implements IDynamic<T> {
  constructor(private readonly state: LocalSyncState<T>) {}

  private readonly outputDynamic = cached(() => {
    return new Dynamic({
      get: this.state.get,
      set: this.state.set,
      subscribe: this.state.onUpdate,
      destroy: this.state.destroy,
    })
  })

  get(): T {
    return this.outputDynamic().get()
  }

  set(value: T | ((lastValue: T) => T)) {
    this.outputDynamic().set(value)
  }

  subscribe(callback: (value: T, lastValue: T) => void): () => void {
    return this.outputDynamic().subscribe(callback)
  }

  destroy() {
    this.outputDynamic().destroy()
  }
}
