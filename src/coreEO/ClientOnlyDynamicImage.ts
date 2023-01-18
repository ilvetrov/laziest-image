import cached from './cached'
import { IDynamicImage, IDynamicImageStatus } from './DynamicImage'
import { NeverDynamic } from './NeverDynamic'
import { ReadOnlyDynamic } from './ReadOnlyDynamic'

export class ClientOnlyDynamicImage implements IDynamicImage {
  constructor(
    private readonly origin: IDynamicImage,
    private readonly serverImageStatus: IDynamicImageStatus,
  ) {}

  private readonly serverStatus = cached(
    () => new ReadOnlyDynamic(new NeverDynamic(this.serverImageStatus)),
  )

  private didInitWaiting = false

  status(): ReadOnlyDynamic<IDynamicImageStatus> {
    if (typeof window === 'undefined') {
      return this.serverStatus()
    }

    return this.origin.status()
  }

  async load() {
    if (typeof window === 'undefined') {
      return
    }

    if (!this.didInitWaiting) {
      setTimeout(() => {
        this.didInitWaiting = true
        this.origin.load()
      }, 0)

      return
    }

    this.origin.load()
  }

  destroy(): void {
    if (typeof window === 'undefined') {
      return
    }

    this.origin.destroy()
  }
}
