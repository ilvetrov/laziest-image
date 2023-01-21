import { afterPageLoad } from './afterPageLoad'
import { Destroyers } from './decorated-js/Destroyers'
import once from './decorated-js/onceMethod'
import { IReactive } from './decorated-js/Reactive'
import { ILazyImage, ImageSrcData } from './LazyImage'

export class LazyImageAfterPageLoad implements ILazyImage {
  constructor(private readonly origin: ILazyImage) {}

  private destroyers = new Destroyers()

  @once
  async srcData(): Promise<IReactive<ImageSrcData>> {
    const status = afterPageLoad()

    this.destroyers.add(status.destroy)

    await status.promise

    return this.origin.srcData()
  }

  destroy(): void {
    this.destroyers.destroyAll()
    this.origin.destroy()
  }
}
