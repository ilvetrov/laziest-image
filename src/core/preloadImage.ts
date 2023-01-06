import PureHandlers from 'pure-handlers'

type Destroy = () => void

export default function preloadImage(props: {
  src: string
  srcSet?: string
  sizes?: string
  keepWatching?: boolean
  onLoad(src: string): void
  onError?(event: Event): void
}): Destroy {
  let destroyed = false

  const virtualImage = new Image()

  const pureHandlers = new PureHandlers()

  virtualImage.decoding = 'async'

  pureHandlers.addEventListener(virtualImage, 'load', () => {
    if (!destroyed) {
      props.onLoad(virtualImage.currentSrc)

      if (!props.keepWatching) {
        pureHandlers.destroy()
      }
    }
  })

  if (props.onError) {
    ;['abort', 'error', 'suspend'].forEach((eventName) => {
      pureHandlers.addEventListener(virtualImage, eventName, (event) => {
        if (!destroyed && props.onError) {
          props.onError(event)

          if (!props.keepWatching) {
            pureHandlers.destroy()
          }
        }
      })
    })
  }

  if (props.srcSet) {
    virtualImage.srcset = props.srcSet
  }

  if (props.sizes) {
    virtualImage.sizes = props.sizes
  }

  virtualImage.src = props.src

  return () => {
    virtualImage.src = ''
    virtualImage.srcset = ''
    virtualImage.sizes = ''
    destroyed = true
    pureHandlers.destroy()
  }
}
