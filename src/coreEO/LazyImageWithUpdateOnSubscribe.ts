import once from './decorated-js/onceMethod'
import { IReactive } from './decorated-js/Reactive'
import { ReactiveWithUpdateOnSubscribe } from './decorated-js/ReactiveWithUpdateOnSubscribe'
import { ILazyImage, ImageSrcData } from './LazyImage'
import { makeOptional } from './LazyImageOptional'

class LazyImageWithUpdateOnSubscribe implements ILazyImage {
  constructor(private readonly origin: ILazyImage) {}

  @once
  async srcData(): Promise<IReactive<ImageSrcData>> {
    return new ReactiveWithUpdateOnSubscribe(await this.origin.srcData())
  }

  defaultSrcData(): ImageSrcData {
    return this.origin.defaultSrcData()
  }

  destroy(): void {
    this.origin.destroy()
  }
}

export default makeOptional(LazyImageWithUpdateOnSubscribe)
