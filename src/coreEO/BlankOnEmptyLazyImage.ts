import { createBlank } from '../core/blank'
import { LocalReactive, ILocalReactive } from './decorated-js/LocalReactive'
import once from './decorated-js/onceMethod'
import { IReactive, Reactive } from './decorated-js/Reactive'
import { ReactiveFromReactive } from './decorated-js/ReactiveFromReactive'
import { ILazyImage, ImageSrcData } from './LazyImage'

export class BlankOnEmptyLazyImage implements ILazyImage {
  constructor(
    private readonly origin: ILazyImage,
    private readonly width?: number,
    private readonly height?: number,
  ) {}

  @once
  private get blankSrcData(): ImageSrcData {
    return {
      src:
        this.width !== undefined && this.height !== undefined
          ? createBlank(this.width, this.height)
          : '',
      srcSet: '',
      sizes: '',
    }
  }

  defaultSrcData(): ImageSrcData {
    return this.blankSrcData
  }

  @once
  private async blankedImageSrcData(): Promise<ILocalReactive<ImageSrcData>> {
    const originSrcData = await this.origin.srcData()

    return new LocalReactive(
      new Reactive(
        () => (originSrcData.current().src ? originSrcData.current() : this.blankSrcData),
        originSrcData.onChange,
      ),
    )
  }

  @once
  async srcData(): Promise<IReactive<ImageSrcData>> {
    return new ReactiveFromReactive(await this.blankedImageSrcData())
  }

  async destroy() {
    ;(await this.blankedImageSrcData()).unsubscribeLocal()
    this.origin.destroy()
  }
}
