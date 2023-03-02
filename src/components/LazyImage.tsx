import React, { forwardRef, memo } from 'react'
import { Cached } from '../core/Cached/Cached'
import { Config } from '../core/Config/Config'
import { DefaultConfig } from '../core/Config/DefaultConfig'
import { OmitedConfig } from '../core/Config/OmitedConfig'
import { RestConfig, SlicedConfig } from '../core/Config/SlicedConfig'
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
  forwardRef<HTMLImageElement, LazyImageElementProps>(function LazyImage(userProps, userRef) {
    const ref = useCombinedRef(userRef)

    const stableCallbacks = useStableCallbacksIn({
      onLoad: userProps.onLoad,
      onFirstLoad: userProps.onFirstLoad,
      onSrcChange: userProps.onSrcChange,
    })

    const userConfig = Config(userProps)
    const noElementConfig = Cached(
      SlicedConfig(userConfig, [
        'src',
        'srcSet',
        'sizes',
        'width',
        'height',
        'afterPageLoad',
        'customLoading',
        'withoutBlank',
        'priority',
        'withoutWatchingSrcChange',
        'xOffset',
        'yOffset',
        'disabledPreload',
        'onLoad',
        'onFirstLoad',
        'onSrcChange',
      ]),
    )
    const elementConfig = Cached(RestConfig(userConfig, noElementConfig))
    const lazyConfig = Cached(
      DefaultConfig(OmitedConfig(noElementConfig, ['onLoad', 'onFirstLoad', 'onSrcChange']), {
        withoutWatchingSrcChange: true,
        disabledPreload: true,
      }),
    )

    const { src, srcSet, sizes, loaded } = useSrc(
      useLazyImage(ref, useNativeProps(lazyConfig.content())),
    )

    return (
      <img
        {...(lazyConfig.content().priority
          ? {
              fetchpriority: 'high',
            }
          : {})}
        {...elementConfig.content()}
        ref={ref}
        src={src || undefined}
        srcSet={srcSet || undefined}
        sizes={sizes || undefined}
        width={lazyConfig.content().width}
        height={lazyConfig.content().height}
        onLoad={useOnLoadListenersOnlyOnLoaded(
          useOnLoadListeners(
            () => ref.current?.currentSrc,
            stableCallbacks.onLoad,
            stableCallbacks.onFirstLoad,
            stableCallbacks.onSrcChange,
          ),
          loaded,
        )}
        loading={lazyConfig.content().priority ? undefined : 'lazy'}
        decoding={lazyConfig.content().priority ? undefined : 'async'}
        style={
          lazyConfig.content().priority
            ? {}
            : { contentVisibility: 'auto', ...elementConfig.content().style }
        }
      />
    )
  }),
)

export default LazyImage
