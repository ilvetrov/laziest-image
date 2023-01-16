import { IDynamicImage, IDynamicImageStatus } from './DynamicImage'
import { NeverDynamic } from './NeverDynamic'
import { ReadOnlyDynamic } from './ReadOnlyDynamic'

export class ManualLoadedDynamicImage implements IDynamicImage {
  constructor(private readonly origin: IDynamicImage, private readonly canLoad: boolean) {}

  status(): ReadOnlyDynamic<IDynamicImageStatus> {
    if (this.canLoad) {
      return this.origin.status()
    }

    return new ReadOnlyDynamic(
      new NeverDynamic({
        readySrc: '',
        loaded: false,
      }),
    )
  }

  load(): void {
    if (this.canLoad) {
      return this.origin.load()
    }
  }

  destroy(): void {
    this.status().destroy()
    this.origin.destroy()
  }
}
