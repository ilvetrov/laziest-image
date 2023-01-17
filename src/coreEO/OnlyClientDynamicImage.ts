import { IDynamicImage, IDynamicImageStatus } from './DynamicImage'
import { NeverDynamic } from './NeverDynamic'
import { ReadOnlyDynamic } from './ReadOnlyDynamic'

export class OnlyClientDynamicImage implements IDynamicImage {
  constructor(private readonly origin: IDynamicImage) {}

  status(): ReadOnlyDynamic<IDynamicImageStatus> {
    if (typeof window === 'undefined') {
      return new ReadOnlyDynamic<IDynamicImageStatus>(
        new NeverDynamic({
          readySrc: '',
          loaded: false,
        }),
      )
    }

    return this.origin.status()
  }

  async load() {
    if (typeof window === 'undefined') {
      return
    }

    this.origin.load()
  }

  destroy(): void {
    this.origin.destroy()
  }
}
