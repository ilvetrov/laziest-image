import { MutableRefObject, useMemo } from 'react'
import { DecoratorsChainOptional } from '../coreFP/DecoratorsChain'
import { If } from '../coreFP/If'
import { BlankedLazyImage } from '../coreFP/LazyImage/BlankedLazyImage'
import { ILazyImage, LazyImage } from '../coreFP/LazyImage/LazyImage'
import { LazyImageAfterPageLoad } from '../coreFP/LazyImage/LazyImageAfterPageLoad'
import { LazyImageEvents } from '../coreFP/LazyImage/LazyImageEvents'
import { LazyImageInVisibleArea } from '../coreFP/LazyImage/LazyImageInVisibleArea'
import { LazyImageVirtual } from '../coreFP/LazyImage/LazyImageVirtual'
import { LazyImageWithUpdateOnlyIfVisible } from '../coreFP/LazyImage/LazyImageWithUpdateOnlyIfVisible'
import { PreloadedLazyImage } from '../coreFP/LazyImage/PreloadedLazyImage'
import { OneMemory } from '../coreFP/Memory/OneMemory'
import { NonNullable } from '../coreFP/NonNullable/NonNullable'
import { LazyImageProps } from './LazyImageProps'

const initSrc = { src: '', srcSet: '', sizes: '', loaded: false }

export function useLazyImage(
  ref: MutableRefObject<HTMLElement | null>,
  props: LazyImageProps,
): ILazyImage {
  const didFirstLoad = useMemo(() => OneMemory(false), [])

  return useMemo(() => {
    const needEmptyInit = Boolean(props.afterPageLoad || props.customLoading)

    const finalSrc = {
      src: props.src,
      srcSet: props.srcSet ?? '',
      sizes: props.sizes ?? '',
      loaded: true,
    }

    return DecoratorsChainOptional(
      [
        [
          (origin) =>
            LazyImageEvents(
              origin,
              props.onLoad,
              props.onFirstLoad,
              props.onSrcChange,
              didFirstLoad,
            ),
          props.onLoad || props.onFirstLoad || props.onSrcChange,
        ],
        [
          (origin) =>
            LazyImageInVisibleArea(
              origin,
              () => NonNullable(ref.current),
              props.customLoading?.yOffset,
              props.customLoading?.xOffset,
            ),
          props.customLoading,
        ],
        [BlankedLazyImage, !props.customLoading?.withoutBlank && needEmptyInit],
        [LazyImageAfterPageLoad, props.afterPageLoad],
        [PreloadedLazyImage, props.customLoading?.withoutWatchingSrcChange],
        [
          (origin) =>
            LazyImageWithUpdateOnlyIfVisible(
              origin,
              () => NonNullable(ref.current),
              props.customLoading?.yOffset,
              props.customLoading?.xOffset,
            ),
          props.customLoading && !props.customLoading?.withoutWatchingSrcChange,
        ],
      ],
      If(
        LazyImageVirtual,
        LazyImage,
        props.customLoading && !props.customLoading?.withoutWatchingSrcChange,
      )(finalSrc, needEmptyInit ? initSrc : finalSrc),
    )
  }, Object.values(props))
}
