import cached from './cached'
import { Destroyers } from './Destroyers'
import { IDynamicImage, IDynamicImageStatus } from './DynamicImage'
import { ReadOnlyDynamic } from './ReadOnlyDynamic'
import waitInVisibleArea from './waitInVisibleArea'

export class ImageWaitInVisibleArea implements IDynamicImage {
  constructor(
    private readonly origin: IDynamicImage,
    private readonly element: HTMLElement,
    private readonly yOffset?: number,
    private readonly xOffset?: number,
  ) {}

  status(): ReadOnlyDynamic<IDynamicImageStatus> {
    return this.origin.status()
  }

  private readonly destroyers = cached(() => new Destroyers())

  async load() {
    const waitingInVisibleArea = waitInVisibleArea({
      element: this.element,
      yOffset: this.yOffset,
      xOffset: this.xOffset,
    })

    this.destroyers().add(waitingInVisibleArea.destroyer)

    await waitingInVisibleArea.promise

    this.origin.load()
  }

  destroy(): void {
    this.destroyers().destroyAll()
    this.origin.destroy()
  }
}
