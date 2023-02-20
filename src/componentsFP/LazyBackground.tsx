import React, { forwardRef, memo, useMemo } from 'react'
import useCombinedRef from '../hooks/useCombinedRef'
import { useStableCallbacksIn } from '../hooks/useStableCallback'
import { LazyImageProps } from './LazyImageProps'
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
      onLoad,
      onFirstLoad,
      onSrcChange,
      ...elementProps
    },
    userRef,
  ) {
    const props: LazyBackgroundProps = {
      src,
      srcSet,
      sizes,
      width,
      height,
      afterPageLoad,
      customLoading: useMemo(
        () => ({
          withoutBlank: true,
          ...customLoading,
        }),
        [customLoading],
      ),
      ...useStableCallbacksIn({
        onLoad,
        onFirstLoad,
        onSrcChange,
      }),
    }

    const ref = useCombinedRef(userRef)

    const { src: resultSrc, loaded } = useSrc(
      useLazyImage(ref, {
        src: props.src,
        sizes: props.sizes,
        srcSet: props.srcSet,
        width: props.width,
        afterPageLoad: props.afterPageLoad,
        customLoading: props.customLoading,
        height: props.height,
        onLoad: props.onLoad,
        onFirstLoad: props.onFirstLoad,
        onSrcChange: props.onSrcChange,
      }),
    )

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
