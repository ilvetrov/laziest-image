export default function preloadImage(props: { src: string; srcSet?: string; sizes?: string }): {
  load: Promise<string>
  cancelLoading: () => void
  virtualImage: HTMLImageElement
} {
  const virtualImage = new Image()

  const promiseLoad = new Promise<string>((resolve, reject) => {
    virtualImage.addEventListener('load', () => resolve(virtualImage.currentSrc))
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
