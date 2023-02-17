import PureHandlers from 'pure-handlers'
import { ISrc } from './Src/Src'

type Destroyer = () => void

export function preloadImage({
  src,
  onLoad,
  onError,
  keepWatching = false,
}: {
  src: ISrc
  onLoad: (src: ISrc) => void
  onError?: (error: Event) => void
  keepWatching?: boolean
}): Destroyer {
  const virtualImage = new Image()
  const pureHandlers = new PureHandlers()

  virtualImage.decoding = 'async'

  let destroyed = false
  pureHandlers.addDestroyer(() => (destroyed = true))

  pureHandlers.addEventListener(virtualImage, 'load', () => {
    if (destroyed) return

    onLoad({ ...src, src: virtualImage.currentSrc })

    if (!keepWatching) {
      pureHandlers.destroy()
    }
  })
  ;['abort', 'error', 'suspend'].forEach((eventName) => {
    pureHandlers.addEventListener(virtualImage, eventName, (event) => {
      if (destroyed) return

      if (onError) {
        onError(event)
      } else {
        throw new Error(`Image not loaded`)
      }
    })
  })

  if (src.sizes) {
    virtualImage.sizes = src.sizes
  }

  if (src.srcSet) {
    virtualImage.srcset = src.srcSet
  }

  virtualImage.src = src.src

  return () => {
    pureHandlers.destroy()
    virtualImage.src = ''
    virtualImage.srcset = ''
    virtualImage.sizes = ''
  }
}
