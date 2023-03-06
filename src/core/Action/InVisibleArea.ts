import { UniqueDestroyers } from '../Destroyers/UniqueDestroyers'
import { xOffsetDefault, yOffsetDefault } from '../LazyImageProps/LazyImageProps'
import { Action, IAction, ISimpleAction } from './Action'

export function InVisibleArea(
  action: ISimpleAction,
  element: () => HTMLElement,
  yOffset = yOffsetDefault,
  xOffset = xOffsetDefault,
): IAction {
  return () => {
    const destroyers = UniqueDestroyers()

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          destroyers.add('action', Action(action)())
          observer.disconnect()
        }
      },
      {
        rootMargin: `${yOffset} ${xOffset} ${yOffset} ${xOffset}`,
      },
    )

    observer.observe(element())
    destroyers.add('observer', () => observer.disconnect())

    return () => {
      destroyers.destroyAll()
    }
  }
}
