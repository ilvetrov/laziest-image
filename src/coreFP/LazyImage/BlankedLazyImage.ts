import { ReactiveMiddleware } from '../Reactive/ReactiveMiddleware'
import { BlankedSrc } from '../Src/BlankedSrc'
import { ILazyImage } from './LazyImage'

export function BlankedLazyImage(origin: ILazyImage): ILazyImage {
  return {
    src: () => ReactiveMiddleware(origin.src(), BlankedSrc, BlankedSrc),
    load: origin.load,
    unload: origin.unload,
  }
}
