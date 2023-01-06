import React, { forwardRef, memo } from 'react'
import { ImageProps, imagePropsKeys } from '../core/ImageProps'
import omitObjectKeys from '../core/omitObjectKeys'
import useCombinedRef from '../hooks/useCombinedRef'
import useLazyImage from '../hooks/useLazyImage'

interface LazyBackgroundOwnProps extends Omit<ImageProps, 'width' | 'height'> {
  style?: Omit<React.CSSProperties, 'backgroundImage' | 'background'>
}

interface LazyBackgroundProps
  extends LazyBackgroundOwnProps,
    Omit<
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      keyof LazyBackgroundOwnProps
    > {}

const LazyBackground = forwardRef<HTMLDivElement, LazyBackgroundProps>((props, parentRef) => {
  const ref = useCombinedRef(parentRef)
  const { readySrc, loaded } = useLazyImage(ref, {
    ...props,
    customLoading: {
      ...props.customLoading,
      withoutBlank: true,
    },
  })

  return (
    <div
      {...omitObjectKeys(props, imagePropsKeys as (keyof LazyBackgroundProps)[])}
      style={{ ...props.style, backgroundImage: loaded ? `url(${readySrc})` : undefined }}
      ref={ref}
    ></div>
  )
})

export default memo(LazyBackground)
