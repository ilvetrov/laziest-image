import { DependencyList, useEffect, useState } from 'react'
import { ILazyImage } from '../../core/LazyImage/LazyImage'
import { ISrc } from '../../core/Src/Src'

const initSrc = { src: '', srcSet: '', sizes: '', loaded: false }

export default function useSrc(getLazyImage: () => ILazyImage, deps: DependencyList): ISrc {
  const [src, setSrc] = useState<ISrc>(initSrc)

  useEffect(() => {
    const lazyImage = getLazyImage()

    lazyImage.load()

    setSrc(lazyImage.src().current())
    lazyImage.src().onChange((newSrc) => setSrc(newSrc))

    return () => lazyImage.unload()
  }, deps)

  return src
}
