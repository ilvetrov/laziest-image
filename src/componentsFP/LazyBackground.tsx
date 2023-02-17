import React, { memo, useEffect, useMemo, useRef } from 'react'
import { useStableCallbacksIn } from '../hooks/useStableCallback'
import { LazyImageProps } from './LazyImageProps'
import { useLazyImage } from './useLazyImage'
import { useOnLoadListeners } from './useOnLoadListeners'
import { useSrc } from './useSrc'

type LazyBackgroundProps = LazyImageProps & {
  div?: Omit<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'style'
  > & {
    style?: Omit<React.CSSProperties, 'backgroundImage' | 'background'>
  }
}

function LazyBackground(rawProps: LazyBackgroundProps) {
  const props: LazyBackgroundProps = {
    ...rawProps,
    customLoading: useMemo(
      () => ({
        withoutBlank: true,
        ...rawProps.customLoading,
      }),
      [rawProps.customLoading],
    ),
    ...useStableCallbacksIn({
      onLoad: rawProps.onLoad,
      onFirstLoad: rawProps.onFirstLoad,
      onSrcChange: rawProps.onSrcChange,
    }),
  }

  const ref = useRef<HTMLDivElement>(null)

  const lazyImage = useLazyImage(ref, {
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
  })

  const onLoadListeners = useOnLoadListeners(
    () => lazyImage.src().current().src,
    props.onLoad,
    props.onFirstLoad,
    props.onSrcChange,
  )

  useEffect(() => {
    return lazyImage.src().onChange((src) => {
      if (src.loaded) {
        onLoadListeners()
      }
    })
  }, [lazyImage])

  const { src, loaded } = useSrc(lazyImage)

  return (
    <div
      {...props.div}
      style={{ ...props.div?.style, backgroundImage: loaded ? `url(${src})` : undefined }}
      ref={ref}
    ></div>
  )
}

export default memo(LazyBackground)
