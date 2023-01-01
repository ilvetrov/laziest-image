export default function preloadImage(props: { src: string; srcSet?: string; sizes?: string }): {
  load: Promise<string>
  cancelLoading: () => void
  virtualImage: HTMLImageElement
} {
  const virtualImage = new Image()

  virtualImage.decoding = 'async'

  const promiseLoad = new Promise<string>((resolve, reject) => {
    virtualImage.addEventListener('load', () => {
      virtualImage
        .decode()
        .then(() => resolve(virtualImage.currentSrc))
        .catch(() => reject())
    })
    ;['abort', 'error', 'suspend'].forEach((eventName) => {
      virtualImage.addEventListener(eventName, () => reject())
    })
  })

  if (props.srcSet) {
    virtualImage.srcset = props.srcSet
  }

  if (props.sizes) {
    virtualImage.sizes = props.sizes
  }

  virtualImage.src = props.src

  return {
    load: promiseLoad,
    cancelLoading: () => (virtualImage.src = ''),
    virtualImage,
  }
}
