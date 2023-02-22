import React, { forwardRef, memo } from 'react'
import { LazyImageProps } from '../core/LazyImageProps/LazyImageProps'
import useCombinedRef from '../hooks/useCombinedRef'
import { useStableCallbacksIn } from '../hooks/useStableCallback'
import { useLazyImage } from './useLazyImage'
import { useNativeProps } from './useNativeProps'
import { useOnLoadListeners, useOnLoadListenersOnlyOnLoaded } from './useOnLoadListeners'
import { useSrc } from './useSrc'

type LazyImageElementProps = LazyImageProps &
  Omit<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    keyof LazyImageProps
  >

const LazyImage = memo(
  forwardRef<HTMLImageElement, LazyImageElementProps>(function LazyImage(
    {
      src: userSrc,
      srcSet: userSrcSet,
      sizes: userSizes,
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
    const ref = useCombinedRef(userRef)

    const props: LazyImageProps = {
      src: userSrc,
      srcSet: userSrcSet,
      sizes: userSizes,
      width,
      height,
      afterPageLoad,
      withoutWatchingSrcChange: withoutWatchingSrcChange ?? true,
      withoutBlank,
      customLoading,
      xOffset,
      yOffset,
    }

    const stableLoadListeners = useStableCallbacksIn({
      onLoad,
      onFirstLoad,
      onSrcChange,
    })

    const { src, srcSet, sizes, loaded } = useSrc(useLazyImage(ref, useNativeProps(props)))

    return (
      <img
        {...elementProps}
        ref={ref}
        src={src || undefined}
        srcSet={srcSet || undefined}
        sizes={sizes || undefined}
        width={props.width}
        height={props.height}
        onLoad={useOnLoadListenersOnlyOnLoaded(
          useOnLoadListeners(
            () => ref.current?.currentSrc,
            stableLoadListeners.onLoad,
            stableLoadListeners.onFirstLoad,
            stableLoadListeners.onSrcChange,
          ),
          loaded,
        )}
        loading="lazy"
        decoding="async"
      />
    )
  }),
)

export default LazyImage
