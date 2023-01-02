import { usePureHandlers } from 'pure-handlers/react'
import { MutableRefObject, useEffect, useState } from 'react'
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
  loaded: boolean
  outputSrc: string
  cancelLoading: () => void
} {
  const [{ loaded, outputSrc }, setImageInfo] = useState({
    outputSrc: props.withBrowserLazyLoading ? props.src : '',
    loaded: props.withBrowserLazyLoading || false,
  })

  const loadingHandlers = usePureHandlers()

  const onLoadOptional = useEventOptional(props.onLoad)
  const onFirstLoadOptional = useEventOptional(props.onFirstLoad)
  const onSrcSetChangeOptional = useEventOptional(props.onSrcSetChange)

  const setVirtualImage = useWatchVirtualImage((newSrc) => {
    if (props.watchForVirtualImage) {
      setImageInfo((oldInfo) => ({ ...oldInfo, outputSrc: newSrc }))

      onLoadOptional(newSrc)
      onSrcSetChangeOptional(newSrc)
    }
  })

  useEffect(() => {
    if (props.withBrowserLazyLoading && !browserSupportsLazyLoading) {
      setImageInfo(() => ({ outputSrc: '', loaded: false }))
    }
  }, [])

  useEffect(() => {
    if (!props.load || loaded || (props.withBrowserLazyLoading && browserSupportsLazyLoading)) {
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
            setImageInfo(() => ({ outputSrc: loadedSrc, loaded: true }))

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
