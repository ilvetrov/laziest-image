import { DecoratorsChainOptional } from './DecoratorsChain/DecoratorsChain'
import { If } from './If/If'
import { BlankedLazyImage } from './LazyImage/BlankedLazyImage'
import { ILazyImage, LazyImage } from './LazyImage/LazyImage'
import { LazyImageAfterPageLoad } from './LazyImage/LazyImageAfterPageLoad'
import { LazyImageEvents } from './LazyImage/LazyImageEvents'
import { LazyImageInVisibleArea } from './LazyImage/LazyImageInVisibleArea'
import { LazyImageWithUpdateOnlyIfVisible } from './LazyImage/LazyImageWithUpdateOnlyIfVisible'
import { VirtualImage } from './LazyImage/VirtualImage'
import { LazyImageProps } from './LazyImageProps/LazyImageProps'
import { IMemory } from './Memory/Memory'

const initSrc = { src: '', srcSet: '', sizes: '', loaded: false }

export function LazyImageByProps(
  props: LazyImageProps,
  element: () => HTMLElement,
  didFirstLoad: IMemory<boolean>,
): ILazyImage {
  const needEmptyInit = Boolean(props.afterPageLoad || props.customLoading) && !props.priority

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
          LazyImageEvents(origin, props.onLoad, props.onFirstLoad, props.onSrcChange, didFirstLoad),
        props.onLoad || props.onFirstLoad || props.onSrcChange,
      ],
      [
        (origin) => LazyImageInVisibleArea(origin, element, props.yOffset, props.xOffset),
        props.customLoading && !props.priority,
      ],
      [BlankedLazyImage, !props.withoutBlank && needEmptyInit],
      [LazyImageAfterPageLoad, props.afterPageLoad],
      [
        (origin) => LazyImageWithUpdateOnlyIfVisible(origin, element, props.yOffset, props.xOffset),
        props.customLoading && !props.withoutWatchingSrcChange && !props.priority,
      ],
    ],
    If(
      props.customLoading && !props.disabledPreload && !props.priority,
      () => VirtualImage(finalSrc, !props.withoutWatchingSrcChange),
      () => LazyImage(finalSrc, needEmptyInit ? initSrc : finalSrc),
    )(),
  )
}
