import React, { useRef } from 'react'
import { LazyImageProps } from '../coreOO/LazyImageProps'
import { useStableCallbacksIn } from '../hooks/useStableCallback'
import { useCustomLazy } from './useCustomLazy'

export default function LazyImage(rawProps: LazyImageProps) {
  const props = {
    ...rawProps,
    ...rawProps.customLoading,
    ...useStableCallbacksIn({
      onLoad: rawProps.onLoad,
      onFirstLoad: rawProps.onFirstLoad,
      onSrcChange: rawProps.onSrcChange,
    }),
  }

  const ref = useRef<HTMLImageElement>(null)
  const didFirstLoad = useRef(false)

  const { src, srcSet, sizes } = useCustomLazy(ref, props)

  return (
    <img
      ref={ref}
      src={src || undefined}
      srcSet={srcSet || undefined}
      sizes={sizes || undefined}
      width={props.width}
      height={props.height}
      onLoad={() => {
        if (!ref.current) {
          return
        }

        if (props.customLoading) {
          return
        }

        props.onLoad(ref.current.currentSrc)

        if (didFirstLoad.current) {
          props.onSrcChange(ref.current.currentSrc)
        }

        if (!didFirstLoad.current) {
          didFirstLoad.current = true
          props.onFirstLoad(ref.current.currentSrc)
        }
      }}
      loading="lazy"
      decoding="async"
    />
  )
}
