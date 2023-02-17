import { Destroyers } from '../Destroyers/Destroyers'
import { ReactiveMiddleware } from '../Reactive/ReactiveMiddleware'
import { ILazyImage } from './LazyImage'

export function LazyImageWithUpdateOnlyIfVisible(
  origin: ILazyImage,
  element: () => HTMLElement,
  yOffset = '150%',
  xOffset = '50%',
): ILazyImage {
  const destroyers = Destroyers()

  return {
    src: () =>
      ReactiveMiddleware(
        origin.src(),
        (src) => src,
        (src) => {
          return new Promise((resolve) => {
            const observer = new IntersectionObserver(
              (entries) => {
                if (entries[0].isIntersecting) {
                  resolve(src)
                  observer.disconnect()
                }
              },
              {
                rootMargin: `${yOffset ?? '0px'} ${xOffset ?? '0px'} ${yOffset ?? '0px'} ${
                  xOffset ?? '0px'
                }`,
              },
            )

            observer.observe(element())
            destroyers.add(() => observer.disconnect())
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
