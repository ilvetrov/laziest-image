import { UniqueDestroyers } from '../Destroyers/UniqueDestroyers'
import { ILazyImage } from './LazyImage'

export function LazyImageInVisibleArea(
  origin: ILazyImage,
  element: () => HTMLElement,
  yOffset = '150%',
  xOffset = '50%',
): ILazyImage {
  const destroyers = UniqueDestroyers()

  return {
    src: origin.src,
    load() {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            origin.load()
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
      destroyers.add('load', () => observer.disconnect())
    },
    unload() {
      destroyers.destroyAll()
      origin.unload()
    },
  }
}
