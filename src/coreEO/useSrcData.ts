import { useState } from 'react'
import useEffectAsync from './decorated-js/react/useEffectAsync'
import { ILazyImage, ImageSrcData } from './LazyImage'

export default function useSrcData(lazyImage: ILazyImage): ImageSrcData {
  const [srcData, setSrcData] = useState(lazyImage.defaultSrcData())

  useEffectAsync(
    async (onDestroy, destroyed) => {
      const currentSrcData = await lazyImage.srcData()

      if (destroyed.current) {
        return
      }

      setSrcData(currentSrcData.current())
      onDestroy(currentSrcData.onChange((newSrcData) => setSrcData(newSrcData)))
    },
    [lazyImage],
  )

  return srcData
}
