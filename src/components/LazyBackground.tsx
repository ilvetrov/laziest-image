import React, { forwardRef, memo } from 'react'
import { LazyImageProps } from '../core/LazyImageProps/LazyImageProps'
import useCombinedRef from '../hooks/useCombinedRef'
import { useStableCallbacksIn } from '../hooks/useStableCallback'
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
  forwardRef<HTMLDivElement, LazyBackgroundProps>(function LazyBackground(
    {
      src,
      srcSet,
      sizes,
      width,
      height,
      afterPageLoad,
      customLoading,
      withoutBlank,
      withoutWatchingSrcChange,
      xOffset,
      yOffset,
      onLoad,
      onFirstLoad,
      onSrcChange,
      ...elementProps
    },
    userRef,
  ) {
    const props: LazyImageProps = {
      src,
      srcSet,
      sizes,
      width,
      height,
      afterPageLoad,
      customLoading: customLoading ?? true,
      withoutBlank: withoutBlank ?? true,
      withoutWatchingSrcChange,
      xOffset,
      yOffset,
      ...useStableCallbacksIn({
        onLoad,
        onFirstLoad,
        onSrcChange,
      }),
    }

    const ref = useCombinedRef(userRef)

    const { src: resultSrc, loaded } = useSrc(useLazyImage(ref, props))

    return (
      <div
        {...elementProps}
        style={{
          ...elementProps.style,
          backgroundImage: loaded ? `url(${resultSrc})` : undefined,
        }}
        ref={ref}
      ></div>
    )
  }),
)

export default LazyBackground
