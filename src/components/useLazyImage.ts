import { MutableRefObject, useMemo } from 'react'
import { DecoratorsChainOptional } from '../core/DecoratorsChain'
import { If } from '../core/If'
import { BlankedLazyImage } from '../core/LazyImage/BlankedLazyImage'
import { ILazyImage, LazyImage } from '../core/LazyImage/LazyImage'
import { LazyImageAfterPageLoad } from '../core/LazyImage/LazyImageAfterPageLoad'
import { LazyImageEvents } from '../core/LazyImage/LazyImageEvents'
import { LazyImageInVisibleArea } from '../core/LazyImage/LazyImageInVisibleArea'
import { LazyImageVirtual } from '../core/LazyImage/LazyImageVirtual'
import { LazyImageWithUpdateOnlyIfVisible } from '../core/LazyImage/LazyImageWithUpdateOnlyIfVisible'
import { PreloadedLazyImage } from '../core/LazyImage/PreloadedLazyImage'
import { LazyImageProps } from '../core/LazyImageProps/LazyImageProps'
import { OneMemory } from '../core/Memory/OneMemory'
import { NonNullable } from '../core/NonNullable/NonNullable'

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
              props.yOffset,
              props.xOffset,
            ),
          props.customLoading,
        ],
        [BlankedLazyImage, !props.withoutBlank && needEmptyInit],
        [LazyImageAfterPageLoad, props.afterPageLoad],
        [PreloadedLazyImage, props.customLoading && props.withoutWatchingSrcChange],
        [
          (origin) =>
            LazyImageWithUpdateOnlyIfVisible(
              origin,
              () => NonNullable(ref.current),
              props.yOffset,
              props.xOffset,
            ),
          props.customLoading && !props.withoutWatchingSrcChange,
        ],
      ],
      If(
        LazyImageVirtual,
        LazyImage,
        props.customLoading && !props.withoutWatchingSrcChange,
      )(finalSrc, needEmptyInit ? initSrc : finalSrc),
    )
  }, Object.values(props))
}
