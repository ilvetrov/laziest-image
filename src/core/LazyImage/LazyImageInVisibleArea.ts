import { InVisibleArea } from '../Action/InVisibleArea'
import { OnlyDestroyer } from '../Destroyers/Destroyable'
import { UniqueDestroyable } from '../Destroyers/UniqueDestroyable'
import { Offset, xOffsetDefault, yOffsetDefault } from '../LazyImageProps/LazyImageProps'
import { ILazyImage } from './LazyImage'

export function LazyImageInVisibleArea(
  origin: ILazyImage,
  element: () => HTMLElement,
  yOffset: Offset = yOffsetDefault,
  xOffset: Offset = xOffsetDefault,
): ILazyImage {
  const load = UniqueDestroyable(
    OnlyDestroyer(InVisibleArea(origin.load, element, yOffset, xOffset)),
  )

  return {
    src: origin.src,
    load() {
      load.run()
    },
    unload() {
      load.destroy()
      origin.unload()
    },
  }
}
