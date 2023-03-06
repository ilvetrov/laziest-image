import { InVisibleArea } from '../Action/InVisibleArea'
import { OnCommonDestroy } from '../Destroyers/CommonDestroyers'
import { Destroyers } from '../Destroyers/Destroyers'
import { Offset } from '../LazyImageProps/LazyImageProps'
import { ReactiveMiddleware } from '../Reactive/ReactiveMiddleware'
import { ILazyImage } from './LazyImage'

export function LazyImageWithUpdateOnlyIfVisible(
  origin: ILazyImage,
  element: () => HTMLElement,
  yOffset?: Offset,
  xOffset?: Offset,
): ILazyImage {
  const destroyers = Destroyers()

  return {
    src: () =>
      ReactiveMiddleware(
        origin.src(),
        (src) => src,
        (src, onDestroy) => {
          const onCommonDestroy = OnCommonDestroy(destroyers.add, onDestroy)

          return new Promise((resolve) => {
            onCommonDestroy(InVisibleArea(() => resolve(src), element, yOffset, xOffset)())
          })
        },
      ),
    load() {
      origin.load()
    },
    unload() {
      destroyers.destroyAll()
      origin.unload()
    },
  }
}
