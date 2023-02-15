/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { MutableRefObject, useEffect, useMemo } from 'react'
import { BlankOnEmptyLazyImageOptional } from './BlankOnEmptyLazyImage'
import useDomMark from './decorated-js/react/useDomMark'
import useSyncedDomMark from './decorated-js/react/useSyncedDomMark'
import { ILazyImage, LazyImage } from './LazyImage'
import { LazyImageAfterPageLoadOptional } from './LazyImageAfterPageLoad'
import { LazyImageInVisibleAreaOptional } from './LazyImageInVisibleArea'
import { LazyImageProps, CustomLoading } from './LazyImageProps'
import { LazyImageWithBrowserLoadingOptional } from './LazyImageWithBrowserLoading'
import { LazyImageWithWatchingVirtualSrcOptional } from './LazyImageWithWatchingVirtualSrc'

export default function useLazyImage(
  ref: MutableRefObject<HTMLElement>,
  props: LazyImageProps,
): ILazyImage {
  const domMark = useSyncedDomMark(useDomMark())

  const lazyImage = useMemo(() => {
    const customLoadingEnabled = props.customLoading !== undefined
    const customLoadingProp = <T extends keyof CustomLoading>(prop: T): CustomLoading[T] => {
      if (props.customLoading === undefined) {
        throw new Error('props.customLoading is undefined')
      }

      return props.customLoading[prop]
    }

    return new LazyImageAfterPageLoadOptional(
      new LazyImageInVisibleAreaOptional(
        new BlankOnEmptyLazyImageOptional(
          new LazyImageWithWatchingVirtualSrcOptional(
            new LazyImageWithBrowserLoadingOptional(
              new LazyImage(props),
              !customLoadingEnabled,
              props,
            ),
            customLoadingEnabled && !customLoadingProp('withoutWatchingSrcChange'),
          ),
          (customLoadingEnabled && !customLoadingProp('withoutBlank')) || props.afterPageLoad,
          props.width,
          props.height,
        ),
        customLoadingEnabled,
        () => props.customLoading?.element?.current ?? ref.current,
        props.customLoading?.yOffset!,
        props.customLoading?.xOffset!,
      ),
      props.afterPageLoad,
    )
  }, [domMark, ...Object.values(props)])

  useEffect(() => {
    return () => {
      lazyImage.destroy()
    }
  }, [lazyImage])

  return lazyImage
}
