import { MutableRefObject } from 'react'
import { ImageProps, setDefaultImageProps } from '../core/ImageProps'
import useBlank from './useBlank'
import useLazyImageLoading from './useLazyImageLoading'

export interface ImagePropsForHook extends ImageProps {
  ref: MutableRefObject<HTMLElement | null>
}

export default function useLazyImage(rawProps: ImagePropsForHook): {
  loadedSrc: string
  loaded: boolean
} {
  const props = setDefaultImageProps(rawProps)

  const blank = useBlank(props.width, props.height, props.doNotCreateBlank)

  const { outputSrc, loaded, cancelLoading } = useLazyImageLoading(props.ref, props)

  if (!props.load) {
    cancelLoading()

    return { loadedSrc: blank || '', loaded: false }
  }

  return { loadedSrc: outputSrc || blank || '', loaded }
}
