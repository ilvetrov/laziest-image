import React, { forwardRef, memo, useRef } from 'react'
import { browserSupportsLazyLoading } from '../core/browserSupportsLazyLoading'
import { ImageProps, imagePropsKeys } from '../core/ImageProps'
import omitObjectKeys from '../core/omitObjectKeys'
import useCombinedRef from '../hooks/useCombinedRef'
import useLazyImage from '../hooks/useLazyImage'

interface LazyImageProps
  extends ImageProps,
    Omit<
      React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
      keyof ImageProps | 'children'
    > {}

const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>((props, parentRef) => {
  const ref = useCombinedRef(parentRef)
  const { readySrc, loaded } = useLazyImage(ref, props)

  const didFirstLoad = useRef(false)

  return (
    <img
      {...omitObjectKeys(props, imagePropsKeys)}
      src={readySrc}
      srcSet={loaded ? props.srcSet : undefined}
      sizes={props.sizes}
      width={props.width}
      height={props.height}
      ref={ref}
      onLoad={() => {
        if (!ref.current?.currentSrc || props.customLoading || !browserSupportsLazyLoading) {
          return
        }

        if (props.onLoad) {
          props.onLoad(ref.current.currentSrc)
        }

        if (props.onSrcChange && didFirstLoad.current) {
          props.onSrcChange(ref.current.currentSrc)
        }

        if (props.onFirstLoad && !didFirstLoad.current) {
          didFirstLoad.current = true
          props.onFirstLoad(ref.current.currentSrc)
        }
      }}
      loading={props.loading ?? 'lazy'}
    />
  )
})

export default memo(LazyImage)
