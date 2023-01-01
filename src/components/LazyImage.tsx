import React, { forwardRef, memo } from 'react'
import useCombinedRef from '../hooks/useCombinedRef'
import useLazyImage, { ImageProps } from '../hooks/useLazyImage'

interface LazyImageProps
  extends ImageProps,
    Omit<
      React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
      keyof ImageProps | 'children'
    > {}

const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>(
  (
    { src, srcSet, load, xOffset, yOffset, doNotCreateBlank, withBrowserLazyLoading, ...props },
    parentRef,
  ) => {
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
    })

    return (
      <img
        {...props}
        src={loadedSrc}
        srcSet={loaded ? srcSet : undefined}
        ref={ref}
        loading={props.loading ?? 'lazy'}
      />
    )
  },
)

export default memo(LazyImage)
