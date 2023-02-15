import { ControlledReactiveMiddleware } from '../Reactive/ControlledReactiveMiddleware'
import { Reactive } from '../Reactive/Reactive'
import { BlankedSrc } from '../Src/BlankedSrc'
import { ILazyImage } from './LazyImage'

export function BlankedLazyImage(origin: ILazyImage): ILazyImage {
  const reactiveSrc = Reactive(ControlledReactiveMiddleware(origin.src(), BlankedSrc))

  return {
    src: () => reactiveSrc,
    load: origin.load,
    unload() {
      origin.unload()
    },
  }
}
