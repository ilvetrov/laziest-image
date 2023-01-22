import { useMemo } from 'react'
import { ImageSrcData, LazyImage } from './LazyImage'
import { LazyImageProps } from './LazyImageProps'
import useSrcData from './useSrcData'

export default function useLazyImage(props: LazyImageProps): ImageSrcData {
  return useSrcData(
    useMemo(() => {
      return new LazyImage({
        src: props.src,
        srcSet: props.srcSet,
        sizes: props.sizes,
      })
    }, Object.values(props)),
  )
}
