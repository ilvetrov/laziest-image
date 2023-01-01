import React, { forwardRef, memo, useRef } from 'react'
import { browserSupportsLazyLoading } from '../core/browserSupportsLazyLoading'
import { ImageProps, setDefaultImageProps } from '../core/ImageProps'
import useCombinedRef from '../hooks/useCombinedRef'
import useLazyImage from '../hooks/useLazyImage'

interface LazyImageProps
  extends Omit<ImageProps, 'watchForVirtualImage'>,
    Omit<
      React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
      keyof ImageProps | 'children'
    > {}

const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>((rawProps, parentRef) => {
  const {
    src,
    srcSet,
    load,
    xOffset,
    yOffset,
    doNotCreateBlank,
    withBrowserLazyLoading,
    onLoad,
    onFirstLoad,
    onSrcSetChange,
    ...props
  } = setDefaultImageProps(rawProps)

  const ref = useCombinedRef(parentRef)
  const { loadedSrc, loaded } = useLazyImage({
    ref,
    src,
    sizes: props.sizes,
    srcSet,
    width: props.width,
    height: props.height,
    load,
    doNotCreateBlank,
    withBrowserLazyLoading,
    xOffset,
    yOffset,
    onLoad,
    onFirstLoad,
    onSrcSetChange,
  })

  const didFirstLoad = useRef(false)

  return (
    <img
      {...props}
      src={loadedSrc}
      srcSet={loaded ? srcSet : undefined}
      ref={ref}
      onLoad={() => {
        if (!ref.current?.currentSrc) {
          return
        }

        if (!(withBrowserLazyLoading && browserSupportsLazyLoading)) {
          return
        }

        if (onLoad) {
          onLoad(ref.current.currentSrc)
        }

        if (onSrcSetChange && didFirstLoad.current) {
          onSrcSetChange(ref.current.currentSrc)
        }

        if (onFirstLoad && !didFirstLoad.current) {
          didFirstLoad.current = true
          onFirstLoad(ref.current.currentSrc)
        }
      }}
      loading={props.loading ?? 'lazy'}
    />
  )
})

export default memo(LazyImage)
