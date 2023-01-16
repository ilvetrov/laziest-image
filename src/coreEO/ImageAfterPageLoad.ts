import { afterPageLoad } from './afterPageLoad'
import { IDynamicImage, IDynamicImageStatus } from './DynamicImage'
import { ReadOnlyDynamic } from './ReadOnlyDynamic'

export class ImageAfterPageLoad implements IDynamicImage {
  constructor(private readonly origin: IDynamicImage) {}

  status(): ReadOnlyDynamic<IDynamicImageStatus> {
    return this.origin.status()
  }

  private readonly destroyers = new Set<() => void>()

  async load() {
    const waitingAfterPageLoad = afterPageLoad()

    this.destroyers.add(waitingAfterPageLoad.destroy)

    await waitingAfterPageLoad.promise

    this.origin.load()
  }

  destroy(): void {
    this.destroyers.forEach((destroyer) => destroyer())
    this.origin.destroy()
  }
}
