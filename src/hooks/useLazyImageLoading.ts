import { usePureHandlers } from 'pure-handlers/react'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { browserSupportsLazyLoading } from '../core/browserSupportsLazyLoading'
import checkVisibility from '../core/checkVisibility'
import { ImageProps, ImagePropsWithDefault } from '../core/ImageProps'
import { optimizedScrollEventName } from '../core/optimizedScroll'
import preloadImage from '../core/preloadImage'
import { useEventOptional } from './useEvent'
import useWatchVirtualImage from './useWatchVirtualImage'

export default function useLazyImageLoading(
  ref: MutableRefObject<HTMLElement | null>,
  props: ImagePropsWithDefault<ImageProps>,
): {
  loaded: MutableRefObject<boolean>
  outputSrc: string
  cancelLoading: () => void
} {
  const [outputSrc, setOutputSrc] = useState(props.withBrowserLazyLoading ? props.src : '')
  const loaded = useRef(props.withBrowserLazyLoading || false)

  const loadingHandlers = usePureHandlers()

  const onLoadOptional = useEventOptional(props.onLoad)
  const onFirstLoadOptional = useEventOptional(props.onFirstLoad)
  const onSrcSetChangeOptional = useEventOptional(props.onSrcSetChange)

  const setVirtualImage = useWatchVirtualImage((newSrc) => {
    if (props.watchForVirtualImage) {
      setOutputSrc(newSrc)

      onLoadOptional(newSrc)
      onSrcSetChangeOptional(newSrc)
    }
  })

  useEffect(() => {
    if (props.withBrowserLazyLoading && !browserSupportsLazyLoading) {
      setOutputSrc('')
      loaded.current = false
    }
  }, [])

  useEffect(() => {
    if (
      !props.load ||
      loaded.current ||
      (props.withBrowserLazyLoading && browserSupportsLazyLoading)
    ) {
      loadingHandlers.destroy()

      return undefined
    }

    const loadRightNow = props.load === true

    let canSet = true

    const loadNowAndSet = () => {
      loadingHandlers.addDestroyer(() => (canSet = false))

      const {
        load: preloadingImage,
        cancelLoading,
        virtualImage: newVirtualImage,
      } = preloadImage({
        src: props.src,
        srcSet: props.srcSet,
        sizes: props.sizes,
      })

      loadingHandlers.addDestroyer(cancelLoading)

      preloadingImage
        .then((loadedSrc) => {
          if (canSet) {
            loaded.current = true
            setOutputSrc(loadedSrc)

            onLoadOptional(loadedSrc)
            onFirstLoadOptional(loadedSrc)

            if (props.watchForVirtualImage && props.sizes && props.srcSet) {
              setVirtualImage(newVirtualImage, loadedSrc)
            }
          }
        })
        .catch((reason) => {
          if (canSet) {
            throw reason
          }
        })
    }

    if (loadRightNow) {
      loadNowAndSet()
    } else {
      const handler = () => {
        if (!ref.current) {
          throw new Error('The ref is empty')
        }

        if (checkVisibility(ref.current, props.yOffset, props.xOffset)) {
          loadingHandlers.destroy()

          loadNowAndSet()
        }
      }

      loadingHandlers.addEventListener(window, optimizedScrollEventName, handler)

      window.requestAnimationFrame(handler)
    }

    return () => loadingHandlers.destroy()
  }, [props.load, props.withBrowserLazyLoading])

  return {
    loaded,
    outputSrc,
    cancelLoading() {
      loadingHandlers.destroy()
    },
  }
}
