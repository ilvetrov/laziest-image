import PureHandlers from 'pure-handlers'
import { MutableRefObject, useEffect } from 'react'
import { browserSupportsLazyLoading } from '../core/browserSupportsLazyLoading'
import { callAfterPageLoad } from '../core/callAfterPageLoad'
import { getImagePropsToUpdateAll, ImageProps } from '../core/ImageProps'
import waitInVisibleArea from '../core/waitInVisibleArea'

export default function useWaitInVisibleArea(
  ref: MutableRefObject<HTMLElement | null>,
  props: ImageProps,
  onAppear: () => void,
) {
  useEffect(() => {
    const canRun = props.customLoading || !browserSupportsLazyLoading

    if (!ref.current || !canRun) {
      return undefined
    }

    let destroyed = false

    const pureHandlers = new PureHandlers()

    const initLoading = () => {
      if (!ref.current || !canRun || destroyed) {
        return undefined
      }

      const [promise, destroyer] = waitInVisibleArea({
        element: ref.current,
        xOffset: props.customLoading?.xOffset,
        yOffset: props.customLoading?.yOffset,
      })

      promise.then(() => {
        if (!destroyed) {
          onAppear()
        }
      })

      pureHandlers.addDestroyer(destroyer)
    }

    if (props.afterPageLoad) {
      pureHandlers.addDestroyer(callAfterPageLoad(initLoading))
    } else {
      initLoading()
    }

    return () => {
      destroyed = true
    }
  }, getImagePropsToUpdateAll(props))
}
