import PureHandlers from 'pure-handlers'
import { ISrc } from './Src/Src'

type Destroyer = () => void

export function preloadImage(
  src: ISrc,
  onLoad: (src: ISrc) => void,
  keepWatching = false,
): Destroyer {
  const virtualImage = new Image()
  const pureHandlers = new PureHandlers()

  let destroyed = false
  pureHandlers.addDestroyer(() => (destroyed = true))

  pureHandlers.addEventListener(virtualImage, 'load', () => {
    if (destroyed) return

    onLoad({ ...src, src: virtualImage.currentSrc })

    if (!keepWatching) {
      pureHandlers.destroy()
    }
  })

  virtualImage.decoding = 'async'

  if (src.srcSet) {
    virtualImage.srcset = src.srcSet
  }

  if (src.sizes) {
    virtualImage.sizes = src.sizes
  }

  virtualImage.src = src.src

  return () => {
    pureHandlers.destroy()
    virtualImage.src = ''
    virtualImage.srcset = ''
    virtualImage.sizes = ''
  }
}
