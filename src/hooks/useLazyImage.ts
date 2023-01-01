import { usePureHandlers } from 'pure-handlers/react'
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { createBlank } from '../core/blank'
import checkVisibility from '../core/checkVisibility'
import { isServer } from '../core/isServer'
import { optimizedScrollEventName } from '../core/optimizedScroll'
import preloadImage from '../core/preloadImage'
import useWatchVirtualImage from './useWatchVirtualImage'

const browserSupportsLazyLoading = isServer || 'loading' in HTMLImageElement.prototype

export interface ImageProps {
  src: string
  srcSet?: string
  sizes?: string
  width?: number | string
  height?: number | string
  /**
   * @default 'auto'
   */
  load?: boolean | 'auto'
  /**
   * @default true
   */
  withBrowserLazyLoading?: boolean
  /**
   * Ignored if withBrowserLazyLoading is true.
   * @default 800
   */
  yOffset?: number
  /**
   * Ignored if withBrowserLazyLoading is true.
   * @default 400
   */
  xOffset?: number | 'any'
  doNotCreateBlank?: boolean
}

export interface ImagePropsForHook extends ImageProps {
  ref: MutableRefObject<HTMLElement | null>
  watchForVirtualImage?: boolean
}

export type ImagePropsNormalized = WithRequired<
  ImageProps,
  'load' | 'yOffset' | 'xOffset' | 'withBrowserLazyLoading'
>

export type ImagePropsForHookNormalized = WithRequired<
  ImagePropsForHook,
  'load' | 'yOffset' | 'xOffset' | 'withBrowserLazyLoading'
>

type WithRequired<T, Key extends keyof T> = T & { [Property in Key]-?: T[Property] }

export function normalizeImagePropsForHook(props: ImagePropsForHook): ImagePropsForHookNormalized {
  return {
    ...props,
    load: props.load ?? 'auto',
    yOffset: props.yOffset ?? 800,
    xOffset: props.xOffset ?? 400,
    withBrowserLazyLoading: props.withBrowserLazyLoading ?? true,
  }
}

export default function useLazyImage(rawProps: ImagePropsForHook): {
  loadedSrc: string
  loaded: boolean
} {
  const props = normalizeImagePropsForHook(rawProps)

  const blank = useMemo(() => {
    if (!props.doNotCreateBlank && props.width && props.height) {
      return createBlank(props.width, props.height)
    }
  }, [props.width, props.height, props.doNotCreateBlank])

  const [outputSrc, setOutputSrc] = useState(props.withBrowserLazyLoading ? props.src : '')
  const loaded = useRef(props.withBrowserLazyLoading)

  const loadingHandlers = usePureHandlers()

  const currentOutputSrc = useRef(outputSrc)

  currentOutputSrc.current = outputSrc

  const setVirtualImage = useWatchVirtualImage((newSrc) => setOutputSrc(newSrc))

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
        if (!props.ref.current) {
          throw new Error('The ref is empty')
        }

        if (checkVisibility(props.ref.current, props.yOffset, props.xOffset)) {
          loadingHandlers.destroy()

          loadNowAndSet()
        }
      }

      loadingHandlers.addEventListener(window, optimizedScrollEventName, handler)

      window.requestAnimationFrame(handler)
    }

    return () => loadingHandlers.destroy()
  }, [props.load, props.withBrowserLazyLoading, props.watchForVirtualImage])

  if (!props.load) {
    loadingHandlers.destroy()

    return { loadedSrc: blank || '', loaded: false }
  }

  return { loadedSrc: outputSrc || blank || '', loaded: loaded.current }
}
