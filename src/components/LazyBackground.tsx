import React, { forwardRef, memo } from 'react'
import { LazyImageProps } from '../core/LazyImageProps/LazyImageProps'
import { defaultProps } from '../core/Props/defaultProps'
import useCombinedRef from '../hooks/useCombinedRef'
import { useLazyImageProps } from '../hooks/useLazyImageProps'
import { useLazyImage } from './useLazyImage'
import { useSrc } from './useSrc'

type LazyBackgroundProps = LazyImageProps &
  Omit<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    keyof LazyImageProps | 'style'
  > & {
    // eslint-disable-next-line react/no-unused-prop-types
    style?: Omit<React.CSSProperties, 'backgroundImage' | 'background'>
  }

const LazyBackground = memo(
  forwardRef<HTMLDivElement, LazyBackgroundProps>(function LazyBackground(userProps, userRef) {
    const ref = useCombinedRef(userRef)
    const [props, elementProps] = useLazyImageProps(
      defaultProps(userProps, {
        customLoading: true,
        withoutBlank: true,
      }),
    )

    const { src: resultSrc, loaded } = useSrc(useLazyImage(ref, props))

    return (
      <div
        {...elementProps}
        style={{
          ...(elementProps.children ? {} : { contentVisibility: 'auto' }),
          ...elementProps.style,
          backgroundImage: loaded ? `url(${resultSrc})` : undefined,
        }}
        ref={ref}
      ></div>
    )
  }),
)

export default LazyBackground
