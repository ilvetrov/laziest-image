import { useEffect, useState } from 'react'
import { ILazyImage, ImageSrcData } from './LazyImage'

export default function useSrcData(lazyImage: ILazyImage): ImageSrcData {
  const [srcData, setSrcData] = useState(lazyImage.defaultSrcData())

  useEffect(() => {
    lazyImage.srcData().then((currentSrcData) => {
      setSrcData(currentSrcData.current())
      currentSrcData.onChange((newSrcData) => setSrcData(newSrcData))
    })

    return () => lazyImage.destroy()
  }, [lazyImage])

  return srcData
}
