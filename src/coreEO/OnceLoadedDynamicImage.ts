import { IDynamicImage, IDynamicImageStatus } from './DynamicImage'
import { ReadOnlyDynamic } from './ReadOnlyDynamic'

export class OnceLoadedDynamicImage implements IDynamicImage {
  constructor(private readonly origin: IDynamicImage) {}

  private loaded = false

  status(): ReadOnlyDynamic<IDynamicImageStatus> {
    return this.origin.status()
  }

  load(): void {
    if (this.loaded) {
      return
    }

    this.loaded = true

    this.origin.load()
  }

  destroy(): void {
    this.origin.destroy()
  }
}
