import { createBlank } from '../core/blank'
import autobind from './decorated-js/autobind'
import { Destroyers } from './decorated-js/Destroyers'
import { LocalReactive, ILocalReactive } from './decorated-js/LocalReactive'
import once from './decorated-js/onceMethod'
import { IReactive, Reactive } from './decorated-js/Reactive'
import { ReactiveFromReactive } from './decorated-js/ReactiveFromReactive'
import { ILazyImage, ImageSrcData } from './LazyImage'
import { makeOptional } from './LazyImageOptional'

@autobind
export class BlankOnEmptyLazyImage implements ILazyImage {
  constructor(
    private readonly origin: ILazyImage,
    private readonly width?: number | string,
    private readonly height?: number | string,
  ) {}

  private readonly destroyers = new Destroyers()

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
    return this.origin.defaultSrcData().src ? this.origin.defaultSrcData() : this.blankSrcData
  }

  @once
  private async blankedImageSrcData(): Promise<ILocalReactive<ImageSrcData>> {
    const originSrcData = await this.origin.srcData()

    const localReactive = new LocalReactive(
      new Reactive(
        () => (originSrcData.current().src ? originSrcData.current() : this.blankSrcData),
        originSrcData.onChange,
      ),
    )

    this.destroyers.add(() => localReactive.unsubscribeLocal())

    return localReactive
  }

  @once
  async srcData(): Promise<IReactive<ImageSrcData>> {
    return new ReactiveFromReactive(await this.blankedImageSrcData())
  }

  async destroy() {
    this.destroyers.destroyAll()
    this.origin.destroy()
  }
}

export const BlankOnEmptyLazyImageOptional = makeOptional(BlankOnEmptyLazyImage)
