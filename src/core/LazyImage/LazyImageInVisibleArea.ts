import { InVisibleArea } from '../Action/InVisibleArea'
import { UniqueDestroyers } from '../Destroyers/UniqueDestroyers'
import { ILazyImage } from './LazyImage'

export function LazyImageInVisibleArea(
  origin: ILazyImage,
  element: () => HTMLElement,
  yOffset?: string,
  xOffset?: string,
): ILazyImage {
  const destroyers = UniqueDestroyers()

  return {
    src: origin.src,
    load() {
      destroyers.add('load', InVisibleArea(origin.load, element, yOffset, xOffset)())
    },
    unload() {
      destroyers.destroyAll()
      origin.unload()
    },
  }
}
