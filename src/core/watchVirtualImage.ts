import PureHandlers from 'pure-handlers'
import debounce from './debouce'
import { resizeWidthEventName } from './optimized-inner-width'
import preloadImage from './preloadImage'

export type Destroyer = () => void

function watchVirtualImage(props: {
  onChange(newSrc: string): void
  virtualImage: HTMLImageElement
}): Destroyer

function watchVirtualImage(props: {
  onChange(newSrc: string): void
  src: string
  srcSet?: string
  sizes?: string
}): Destroyer

function watchVirtualImage(props: {
  onChange(newSrc: string): void
  virtualImage?: HTMLImageElement
  src?: string
  srcSet?: string
  sizes?: string
}): Destroyer {
  let lastSrc: string | undefined

  const pureHandlers = new PureHandlers()

  const virtualImage: HTMLImageElement =
    props.virtualImage ||
    preloadImage({ src: props.src!, sizes: props.sizes, srcSet: props.srcSet }).virtualImage

  pureHandlers.addEventListener(
    window,
    resizeWidthEventName,
    debounce(() => {
      if (virtualImage.currentSrc !== lastSrc) {
        lastSrc = virtualImage.currentSrc
        props.onChange(virtualImage.currentSrc)
      }
    }, 100),
  )

  return () => pureHandlers.destroy()
}

export default watchVirtualImage
