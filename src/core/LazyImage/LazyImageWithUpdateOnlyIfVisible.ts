import { InVisibleArea } from '../Action/InVisibleArea'
import { Destroyable, OnlyDestroyer } from '../Destroyers/Destroyable'
import { Offset } from '../LazyImageProps/LazyImageProps'
import { ReactiveMiddleware } from '../Reactive/ReactiveMiddleware'
import { ISrc } from '../Src/Src'
import { ILazyImage } from './LazyImage'

export function LazyImageWithUpdateOnlyIfVisible(
  origin: ILazyImage,
  element: () => HTMLElement,
  yOffset?: Offset,
  xOffset?: Offset,
): ILazyImage {
  const onChange = Destroyable(
    OnlyDestroyer(
      InVisibleArea(
        (src: ISrc, changeValue: (value: ISrc) => void) => changeValue(src),
        element,
        yOffset,
        xOffset,
      ),
    ),
  )

  return {
    src: ReactiveMiddleware(
      origin.src,
      (src) => src,
      (value, changeValue) => onChange.run(value, changeValue).destroy,
    ),
    load() {
      origin.load()
    },
    unload() {
      onChange.destroy()
      origin.unload()
    },
  }
}
