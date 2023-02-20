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
        (src, onDestroy) => {
          return new Promise((resolve, reject) => {
            const destroyer = preloadImage({
              src,
              onLoad: () => resolve(src),
              onError: (error) => reject(error),
            })

            onDestroy(destroyer)
            destroyers.add(destroyer)
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
