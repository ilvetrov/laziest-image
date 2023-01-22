import { IReactive } from './decorated-js/Reactive'
import { ILazyImage, ImageSrcData } from './LazyImage'
import neverPromise from './neverPromise'

export class ClientLazyImage implements ILazyImage {
  constructor(
    private readonly origin: ILazyImage,
    private readonly isClient: () => boolean = () => typeof window !== 'undefined',
  ) {}

  srcData(): Promise<IReactive<ImageSrcData>> {
    if (!this.isClient()) {
      return neverPromise()
    }

    return this.origin.srcData()
  }

  defaultSrcData(): ImageSrcData {
    return this.origin.defaultSrcData()
  }

  destroy(): void {
    if (!this.isClient()) {
      return
    }

    this.origin.destroy()
  }
}
