import localSyncState from 'local-sync-state'
import cached from './cached'
import DynamicFromLocalSyncState from './DynamicFromLocalSyncState'
import { IReadOnlyDynamic } from './ReadOnlyDynamic'

export class DynamicWithSubscribeMiddleware<T> implements IReadOnlyDynamic<T> {
  constructor(
    private readonly origin: IReadOnlyDynamic<T>,
    private readonly middleware?: (value: T, lastValue: T) => Promise<T | undefined>,
  ) {}

  private readonly outputDynamic = cached(() => {
    const outputDynamic = new DynamicFromLocalSyncState<T>(localSyncState(this.origin.get()))

    this.origin.subscribe(async (value, lastValue) => {
      if (!this.middleware) {
        outputDynamic.set(value)

        return
      }

      const result = await this.middleware(value, lastValue)

      if (result) {
        outputDynamic.set(result)
      }
    })

    return outputDynamic
  })

  get() {
    return this.outputDynamic().get()
  }

  subscribe(callback: (value: T, lastValue: T) => void) {
    return this.outputDynamic().subscribe(callback)
  }

  destroy(): void {
    this.outputDynamic().destroy()
    this.origin.destroy()
  }
}
