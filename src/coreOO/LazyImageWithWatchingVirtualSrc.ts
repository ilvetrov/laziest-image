import preloadImage from '../core/preloadImage'
import autobind from './decorated-js/autobind'
import { IControlledReactive } from './decorated-js/ControlledReactive'
import { ControlledReactiveFromPlain } from './decorated-js/ControlledReactiveFromPlain'
import { Destroyers } from './decorated-js/Destroyers'
import once from './decorated-js/onceMethod'
import { IReactive, Reactive } from './decorated-js/Reactive'
import { ILazyImage, ImageSrcData } from './LazyImage'
import { makeOptional } from './LazyImageOptional'

@autobind
export class LazyImageWithWatchingVirtualSrc implements ILazyImage {
  constructor(private readonly origin: ILazyImage) {}

  private destroyers = new Destroyers()

  @once
  private async srcDataWithControl(): Promise<IControlledReactive<ImageSrcData>> {
    return new ControlledReactiveFromPlain(await this.origin.srcData())
  }

  defaultSrcData(): ImageSrcData {
    return this.origin.defaultSrcData()
  }

  @once
  async srcData(): Promise<IReactive<ImageSrcData>> {
    const { src, srcSet, sizes } = (await this.srcDataWithControl()).current()

    this.destroyers.add(
      preloadImage({
        src,
        sizes,
        srcSet,
        onLoad: async (newSrc) => {
          const srcDataWithControl = await this.srcDataWithControl()

          srcDataWithControl.changeValue({
            src: newSrc,
            srcSet: srcDataWithControl.current().srcSet,
            sizes: srcDataWithControl.current().sizes,
          })
        },
        keepWatching: true,
      }),
    )

    return new Reactive(
      (await this.srcDataWithControl()).current,
      (await this.srcDataWithControl()).onChange,
    )
  }

  async destroy() {
    this.origin.destroy()
    this.destroyers.destroyAll()
    ;(await this.srcDataWithControl()).unsubscribeAll()
  }
}

export const LazyImageWithWatchingVirtualSrcOptional = makeOptional(LazyImageWithWatchingVirtualSrc)
