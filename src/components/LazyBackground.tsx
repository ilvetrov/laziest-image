import React, { forwardRef, memo } from 'react'
import { Cached } from '../core/Cached/Cached'
import { Config } from '../core/Config/Config'
import { DefaultConfig } from '../core/Config/DefaultConfig'
import { ExtendedConfig } from '../core/Config/ExtendedConfig'
import { RestConfig, SlicedConfig } from '../core/Config/SlicedConfig'
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
  forwardRef<HTMLDivElement, LazyBackgroundProps>(function LazyBackground(userProps, userRef) {
    const ref = useCombinedRef(userRef)

    const userConfig = Config(userProps)
    const lazyConfig = Cached(
      DefaultConfig(
        ExtendedConfig(
          SlicedConfig(userConfig, [
            'src',
            'srcSet',
            'sizes',
            'width',
            'height',
            'afterPageLoad',
            'customLoading',
            'withoutBlank',
            'withoutWatchingSrcChange',
            'xOffset',
            'yOffset',
            'disabledPreload',
          ]),
          useStableCallbacksIn({
            onLoad: userProps.onLoad,
            onFirstLoad: userProps.onFirstLoad,
            onSrcChange: userProps.onSrcChange,
          }),
        ),
        {
          customLoading: true,
          withoutBlank: true,
        },
      ),
    )
    const elementConfig = Cached(RestConfig(userConfig, lazyConfig))

    const { src: resultSrc, loaded } = useSrc(useLazyImage(ref, lazyConfig.content()))

    return (
      <div
        {...elementConfig.content()}
        style={{
          ...elementConfig.content().style,
          backgroundImage: loaded ? `url(${resultSrc})` : undefined,
        }}
        ref={ref}
      ></div>
    )
  }),
)

export default LazyBackground
