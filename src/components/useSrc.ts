import { useEffect, useState } from 'react'
import { ILazyImage } from '../core/LazyImage/LazyImage'
import { ISrc } from '../core/Src/Src'

export function useSrc(lazyImage: ILazyImage): ISrc {
  const [src, setSrc] = useState<ISrc>(lazyImage.src().current())

  useEffect(() => {
    if (src.src !== lazyImage.src().current().src) {
      setSrc(lazyImage.src().current())
    }

    lazyImage.src().onChange((newSrc) => setSrc(newSrc))

    lazyImage.load()

    return () => lazyImage.unload()
  }, [lazyImage])

  return src
}
