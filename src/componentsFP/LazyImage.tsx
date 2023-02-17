import React, { memo, useMemo, useRef } from 'react'
import { useStableCallbacksIn } from '../hooks/useStableCallback'
import { LazyImageProps } from './LazyImageProps'
import { useLazyImage } from './useLazyImage'
import { useNativeProps } from './useNativeProps'
// import { useNativeLazy } from './useNativeLazy'
import { useOnLoadListeners, useOnLoadListenersOnlyOnLoaded } from './useOnLoadListeners'
import { useSrc } from './useSrc'

function LazyImage(rawProps: LazyImageProps) {
  const ref = useRef<HTMLImageElement>(null)

  const props: LazyImageProps = {
    ...rawProps,
    customLoading: useMemo(
      () =>
        rawProps.customLoading && {
          withoutWatchingSrcChange: true,
          ...rawProps.customLoading,
        },
      [rawProps.customLoading],
    ),
    ...useStableCallbacksIn({
      onLoad: rawProps.onLoad,
      onFirstLoad: rawProps.onFirstLoad,
      onSrcChange: rawProps.onSrcChange,
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
        onLoad: props.onLoad,
        onFirstLoad: props.onFirstLoad,
        onSrcChange: props.onSrcChange,
      }),
    ),
  )

  return (
    <img
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
}

export default memo(LazyImage)
