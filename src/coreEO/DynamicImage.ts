import localSyncState from 'local-sync-state'
import cached from './cached'
import DynamicFromLocalSyncState from './DynamicFromLocalSyncState'
import { IImage } from './Image'
import { ReadOnlyDynamic } from './ReadOnlyDynamic'

export interface IDynamicImageStatus {
  readySrc: string
  loaded: boolean
}

export interface IDynamicImage {
  status(): ReadOnlyDynamic<IDynamicImageStatus>
  load(): void
  destroy(): void
}

export class DynamicImage implements IDynamicImage {
  constructor(private readonly origin: IImage) {}

  private destroyed = false

  private readonly statusState = cached(
    () =>
      new DynamicFromLocalSyncState(
        localSyncState({
          readySrc: '',
          loaded: false,
        }),
      ),
  )

  public readonly status = cached(() => new ReadOnlyDynamic(this.statusState()))

  load(): void {
    if (this.destroyed) {
      return
    }

    this.statusState().set({
      readySrc: this.origin.readySrc(),
      loaded: this.origin.loaded(),
    })
  }

  destroy(): void {
    this.destroyed = true
    this.status().destroy()
  }
}
