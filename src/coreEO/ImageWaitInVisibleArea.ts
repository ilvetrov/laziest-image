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

  private readonly destroyers = new Set<() => void>()

  async load() {
    const waitingInVisibleArea = waitInVisibleArea({
      element: this.element,
      yOffset: this.yOffset,
      xOffset: this.xOffset,
    })

    this.destroyers.add(waitingInVisibleArea.destroyer)

    await waitingInVisibleArea.promise

    this.origin.load()
  }

  destroy(): void {
    this.destroyers.forEach((destroyer) => destroyer())
    this.origin.destroy()
  }
}
