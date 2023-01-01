import React, { forwardRef, memo } from 'react'
import { ImageProps, setDefaultImageProps } from '../core/ImageProps'
import useCombinedRef from '../hooks/useCombinedRef'
import useLazyImage from '../hooks/useLazyImage'

interface LazyBackgroundOwnProps
  extends Omit<ImageProps, 'withBrowserLazyLoading' | 'doNotCreateBlank' | 'width' | 'height'> {
  style?: Omit<React.CSSProperties, 'backgroundImage' | 'background'>
}

interface LazyBackgroundProps
  extends LazyBackgroundOwnProps,
    Omit<
      React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      keyof LazyBackgroundOwnProps
    > {}

const LazyBackground = forwardRef<HTMLDivElement, LazyBackgroundProps>((rawProps, parentRef) => {
  const {
    src,
    srcSet,
    sizes,
    load,
    xOffset,
    yOffset,
    style,
    children,
    onLoad,
    onFirstLoad,
    onSrcSetChange,
    watchForVirtualImage,
    ...props
  } = setDefaultImageProps(rawProps)

  const ref = useCombinedRef(parentRef)
  const { loadedSrc, loaded } = useLazyImage({
    ref,
    src,
    sizes,
    srcSet,
    load,
    doNotCreateBlank: true,
    withBrowserLazyLoading: false,
    xOffset,
    yOffset,
    watchForVirtualImage: watchForVirtualImage ?? true,
    onLoad,
    onFirstLoad,
    onSrcSetChange,
  })

  // children are exported to the independent variable
  // to make it clear in a quick read that the component can accept children
  return (
    <div
      {...props}
      style={{ ...style, backgroundImage: loaded ? `url(${loadedSrc})` : undefined }}
      ref={ref}
    >
      {children}
    </div>
  )
})

export default memo(LazyBackground)
