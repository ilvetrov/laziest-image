import { OnlyDestroyer } from '../Destroyers/Destroyable'
import { UniqueDestroyable } from '../Destroyers/UniqueDestroyable'
import { xOffsetDefault, yOffsetDefault } from '../LazyImageProps/LazyImageProps'
import { Action, IAction, IActionOrigin } from './Action'

export function InVisibleArea<T extends IActionOrigin>(
  action: T,
  element: () => HTMLElement,
  yOffset = yOffsetDefault,
  xOffset = xOffsetDefault,
): IAction<T> {
  return (...args) => {
    console.log('BIBA', yOffset, xOffset)

    const destroyableAction = UniqueDestroyable(OnlyDestroyer(Action(action)))

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          destroyableAction.run(...args)
          observer.disconnect()
        }
      },
      {
        rootMargin: `${yOffset} ${xOffset} ${yOffset} ${xOffset}`,
      },
    )

    observer.observe(element())

    return () => {
      observer.disconnect()
      destroyableAction.destroy()
    }
  }
}
