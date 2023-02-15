import { UniqueDestroyers } from '../Destroyers/UniqueDestroyers'
import { ControlledReactive } from '../Reactive/ControlledReactive'
import { Reactive } from '../Reactive/Reactive'
import { ILazyImage } from './LazyImage'

export function LazyImageWithUpdateOnlyIfVisible(
  origin: ILazyImage,
  element: () => HTMLElement,
  yOffset = '150%',
  xOffset = '50%',
): ILazyImage {
  const controlledSrc = ControlledReactive(origin.src().current())
  const destroyers = UniqueDestroyers()

  return {
    src: () => Reactive(controlledSrc),
    load() {
      destroyers.add(
        'onChange',
        origin.src().onChange((newSrc) => {
          const observer = new IntersectionObserver(
            (entries) => {
              if (entries[0].isIntersecting) {
                controlledSrc.changeValue(newSrc)
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
          destroyers.add('waitInVisible', () => observer.disconnect())
        }),
      )
      origin.load()
    },
    unload() {
      destroyers.destroyAll()
      origin.unload()
    },
  }
}
