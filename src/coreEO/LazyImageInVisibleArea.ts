import waitInVisibleArea from '../core/waitInVisibleArea'
import { Destroyers } from './decorated-js/Destroyers'
import once from './decorated-js/onceMethod'
import { IReactive } from './decorated-js/Reactive'
import { ILazyImage, ImageSrcData } from './LazyImage'

export class LazyImageInVisibleArea implements ILazyImage {
  constructor(
    private readonly origin: ILazyImage,
    private readonly element: () => HTMLElement,
    private readonly yOffset?: string,
    private readonly xOffset?: string,
  ) {}

  private destroyers = new Destroyers()

  @once
  async srcData(): Promise<IReactive<ImageSrcData>> {
    const [promise, destroyer] = waitInVisibleArea({
      element: this.element(),
      yOffset: Number(this.yOffset),
      xOffset: Number(this.xOffset),
    })

    this.destroyers.add(destroyer)

    await promise

    return this.origin.srcData()
  }

  defaultSrcData(): ImageSrcData {
    return this.origin.defaultSrcData()
  }

  destroy(): void {
    this.destroyers.destroyAll()
    this.origin.destroy()
  }
}
