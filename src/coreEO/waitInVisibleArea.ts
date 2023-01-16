import PureHandlers from 'pure-handlers'
import checkVisibility from '../core/checkVisibility'
import { optimizedScrollEventName } from '../core/optimizedScroll'

type Destroyer = () => void

export default function waitInVisibleArea(props: {
  element: HTMLElement
  yOffset?: number
  xOffset?: number | 'any'
}): { promise: Promise<void>; destroyer: Destroyer } {
  const pureHandlers = new PureHandlers()

  const promise = new Promise<void>((resolve) => {
    const handleAppearanceInVisibleArea = () => {
      if (checkVisibility(props.element, props.yOffset, props.xOffset)) {
        pureHandlers.destroy()
        resolve()
      }
    }

    pureHandlers.addEventListener(window, optimizedScrollEventName, handleAppearanceInVisibleArea)

    const requestAnimationFrameId = window.requestAnimationFrame(handleAppearanceInVisibleArea)

    pureHandlers.addDestroyer(() => window.cancelAnimationFrame(requestAnimationFrameId))
  })

  const destroyer = () => pureHandlers.destroy()

  return { promise, destroyer }
}
