import { Destroyers } from '../Destroyers/Destroyers'
import { preloadImage } from '../preloadImage'
import { ReactiveMiddleware } from '../Reactive/ReactiveMiddleware'
import { ILazyImage } from './LazyImage'

export function PreloadedLazyImage(origin: ILazyImage): ILazyImage {
  const destroyers = Destroyers()

  return {
    src: () =>
      ReactiveMiddleware(
        origin.src(),
        (src) => src,
        (src) => {
          return new Promise((resolve, reject) => {
            destroyers.add(
              preloadImage({
                src,
                onLoad: () => resolve(src),
                onError: (error) => reject(error),
              }),
            )
          })
        },
      ),
    load: origin.load,
    unload() {
      destroyers.destroyAll()
      origin.unload()
    },
  }
}
