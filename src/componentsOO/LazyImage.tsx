/* eslint-disable react/prop-types */
import React, { MutableRefObject, useRef } from 'react'
import { LazyImageProps } from '../coreOO/LazyImageProps'
import useLazyImage from '../coreOO/useLazyImage'
import useSrcData from '../coreOO/useSrcData'
import { useStableCallbacksIn } from '../hooks/useStableCallback'

export default function LazyImage(rawProps: LazyImageProps) {
  const ref = useRef<HTMLImageElement>(null)
  const didFirstLoad = useRef(false)

  const props = {
    ...rawProps,
    ...useStableCallbacksIn({
      onLoad: rawProps.onLoad,
      onFirstLoad: rawProps.onFirstLoad,
      onSrcChange: rawProps.onSrcChange,
    }),
  }
  const srcData = useSrcData(useLazyImage(ref as MutableRefObject<HTMLElement>, props))

  return (
    <img
      ref={ref}
      src={srcData.src}
      srcSet={srcData.srcSet}
      sizes={srcData.sizes}
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
