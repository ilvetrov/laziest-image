import React, { forwardRef, memo, useMemo } from 'react'
import useCombinedRef from '../hooks/useCombinedRef'
import { useStableCallbacksIn } from '../hooks/useStableCallback'
import { LazyImageProps } from './LazyImageProps'
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
      customLoading: useMemo(
        () =>
          customLoading && {
            withoutWatchingSrcChange: true,
            ...customLoading,
          },
        [customLoading],
      ),
      ...useStableCallbacksIn({
        onLoad,
        onFirstLoad,
        onSrcChange,
      }),
    }

    const { src, srcSet, sizes, loaded } = useSrc(
      useLazyImage(
        ref,
        useNativeProps({
          src: props.src,
          sizes: props.sizes,
          srcSet: props.srcSet,
          width: props.width,
          afterPageLoad: props.afterPageLoad,
          customLoading: props.customLoading,
          height: props.height,
        }),
      ),
    )

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
            props.onLoad,
            props.onFirstLoad,
            props.onSrcChange,
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
