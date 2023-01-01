import { useEffect } from 'react'
import watchVirtualImage from '../core/watchVirtualImage'
import useEvent from './useEvent'

function useWatchVirtualImage(props: {
  onChange(newSrc: string): void
  doNotRun?: boolean
  virtualImage?: HTMLImageElement
})

function useWatchVirtualImage(props: {
  onChange(newSrc: string): void
  doNotRun?: boolean
  src: string
  srcSet?: string
  sizes?: string
})

function useWatchVirtualImage(props: {
  onChange(newSrc: string): void
  doNotRun?: boolean
  virtualImage?: HTMLImageElement
  src?: string
  srcSet?: string
  sizes?: string
}) {
  const onChange = useEvent(props.onChange)

  useEffect(() => {
    if (props.doNotRun) {
      return undefined
    }

    if (props.virtualImage) {
      return watchVirtualImage({ onChange, virtualImage: props.virtualImage })
    }

    if (!props.src) {
      return undefined
    }

    return watchVirtualImage({
      onChange,
      src: props.src,
      srcSet: props.srcSet,
      sizes: props.sizes,
    })
  }, [props.src, props.srcSet, props.sizes, props.virtualImage, props.doNotRun])
}

export default useWatchVirtualImage
