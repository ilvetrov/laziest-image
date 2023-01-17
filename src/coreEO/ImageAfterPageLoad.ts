import { afterPageLoad } from './afterPageLoad'
import cached from './cached'
import { Destroyers } from './Destroyers'
import { IDynamicImage, IDynamicImageStatus } from './DynamicImage'
import { ReadOnlyDynamic } from './ReadOnlyDynamic'

export class ImageAfterPageLoad implements IDynamicImage {
  constructor(private readonly origin: IDynamicImage) {}

  status(): ReadOnlyDynamic<IDynamicImageStatus> {
    return this.origin.status()
  }

  private readonly destroyers = cached(() => new Destroyers())

  async load() {
    const waitingAfterPageLoad = afterPageLoad()

    this.destroyers().add(waitingAfterPageLoad.destroy)

    await waitingAfterPageLoad.promise

    this.origin.load()
  }

  destroy(): void {
    this.destroyers().destroyAll()
    this.origin.destroy()
  }
}
