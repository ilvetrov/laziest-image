import React, { forwardRef, memo } from 'react'
import { LazyImageProps } from '../core/LazyImageProps/LazyImageProps'
import { defaultProps } from '../core/Props/defaultProps'
import { omitObject } from '../core/Props/omitObject'
import useCombinedRef from '../hooks/useCombinedRef'
import { useLazyImageProps } from '../hooks/useLazyImageProps'
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
  forwardRef<HTMLImageElement, LazyImageElementProps>(function LazyImage(userProps, userRef) {
    const ref = useCombinedRef(userRef)
    const [props, elementProps] = useLazyImageProps(
      defaultProps(userProps, {
        withoutWatchingSrcChange: true,
        disabledPreload: true,
      }),
    )

    const { src, srcSet, sizes, loaded } = useSrc(
      useLazyImage(
        ref,
        useNativeProps(omitObject(props, ['onLoad', 'onFirstLoad', 'onSrcChange'])),
      ),
    )

    return (
      <img
        {...(props.priority
          ? {
              fetchpriority: 'high',
            }
          : {})}
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
        loading={props.priority ? undefined : 'lazy'}
        decoding={props.priority ? undefined : 'async'}
        style={props.priority ? {} : { contentVisibility: 'auto', ...elementProps.style }}
      />
    )
  }),
)

export default LazyImage
