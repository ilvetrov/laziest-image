import autobind from './decorated-js/autobind'
import { Destroyers } from './decorated-js/Destroyers'
import once from './decorated-js/onceMethod'
import { IReactive } from './decorated-js/Reactive'
import { ILazyImage, ImageSrcData } from './LazyImage'
import { makeOptional } from './LazyImageOptional'

@autobind
export class LazyImageInVisibleArea implements ILazyImage {
  constructor(
    private readonly origin: ILazyImage,
    private readonly element: () => HTMLElement,
    private readonly yOffset: string = '150%',
    private readonly xOffset: string = '50%',
  ) {}

  private destroyers = new Destroyers()

  @once
  async srcData(): Promise<IReactive<ImageSrcData>> {
    const element = this.element()

    return new Promise((resolve) => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            this.origin.srcData().then((value) => resolve(value))
            observer.disconnect()
          }
        },
        {
          rootMargin: `${this.yOffset ?? '0px'} ${this.xOffset ?? '0px'} ${this.yOffset ?? '0px'} ${
            this.xOffset ?? '0px'
          }`,
        },
      )

      observer.observe(element)
      this.destroyers.add(() => observer.disconnect())
    })
  }

  defaultSrcData(): ImageSrcData {
    return this.origin.defaultSrcData()
  }

  destroy(): void {
    this.destroyers.destroyAll()
    this.origin.destroy()
  }
}

export const LazyImageInVisibleAreaOptional = makeOptional(LazyImageInVisibleArea)
