import { MutableRefObject, useEffect, useMemo, useState } from 'react'
import { DecoratorsChainOptional } from '../coreFP/DecoratorsChain'
import { If } from '../coreFP/If'
import { BlankedLazyImage } from '../coreFP/LazyImage/BlankedLazyImage'
import { LazyImage } from '../coreFP/LazyImage/LazyImage'
import { LazyImageAfterPageLoad } from '../coreFP/LazyImage/LazyImageAfterPageLoad'
import { LazyImageInVisibleArea } from '../coreFP/LazyImage/LazyImageInVisibleArea'
import { LazyImageVirtual } from '../coreFP/LazyImage/LazyImageVirtual'
import { LazyImageWithUpdateOnlyIfVisible } from '../coreFP/LazyImage/LazyImageWithUpdateOnlyIfVisible'
import { PreloadedLazyImage } from '../coreFP/LazyImage/PreloadedLazyImage'
import { NonNullable } from '../coreFP/NonNullable/NonNullable'
import { ISrc } from '../coreFP/Src/Src'

const initSrc = { src: '', srcSet: '', sizes: '', loaded: false }

export function useCustomLazy(
  ref: MutableRefObject<HTMLElement | null>,
  props: {
    src: string
    srcSet?: string
    sizes?: string
    width?: number | string
    height?: number | string
    yOffset?: string
    xOffset?: string
    afterPageLoad?: boolean
    withoutBlank?: boolean
    withoutWatchingSrcChange?: boolean
  },
): ISrc {
  const lazyImage = useMemo(() => {
    const finalSrc = {
      src: props.src,
      srcSet: props.srcSet ?? '',
      sizes: props.sizes ?? '',
      loaded: true,
    }

    return LazyImageInVisibleArea(
      DecoratorsChainOptional(
        // eslint-disable-next-line prettier/prettier
        [
          props.afterPageLoad && LazyImageAfterPageLoad,
          PreloadedLazyImage,
          !props.withoutBlank && BlankedLazyImage,
        ],
        LazyImageWithUpdateOnlyIfVisible(
          If(LazyImage, LazyImageVirtual, props.withoutWatchingSrcChange)(finalSrc, initSrc),
          () => NonNullable(ref.current),
          props.yOffset,
          props.xOffset,
        ),
      ),
      () => NonNullable(ref.current),
      props.yOffset,
      props.xOffset,
    )
  }, Object.values(props))

  const [src, setSrc] = useState<ISrc>(lazyImage.src().current())

  const [ubaCount, setUbaCount] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      if (ubaCount < 1) {
        setUbaCount((old) => old + 1)
      }
    }, 100)

    setSrc(lazyImage.src().current())
    lazyImage.src().onChange((newSrc) => setSrc(newSrc))

    lazyImage.load()

    return () => lazyImage.unload()
  }, [lazyImage, ubaCount])

  return src
}
