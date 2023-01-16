import localSyncState from 'local-sync-state'
import preloadImage from '../core/preloadImage'
import cached from './cached'
import DynamicFromLocalSyncState from './DynamicFromLocalSyncState'
import { IDynamicImage } from './DynamicImage'
import { ReadOnlyDynamic } from './ReadOnlyDynamic'

export class VirtualWatchingImage implements IDynamicImage {
  constructor(
    private readonly src: string,
    private readonly srcSet?: string,
    private readonly sizes?: string,
  ) {}

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

  private readonly destroyers = new Set<() => void>()

  load(): void {
    this.destroyers.add(
      preloadImage({
        src: this.src,
        srcSet: this.srcSet,
        sizes: this.sizes,
        keepWatching: true,
        onLoad: (newSrc) => {
          this.statusState().set({
            readySrc: newSrc,
            loaded: true,
          })
        },
      }),
    )
  }

  destroy(): void {
    this.destroyers.forEach((destroyer) => destroyer())
  }
}
