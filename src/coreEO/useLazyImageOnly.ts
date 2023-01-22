import { useCallback, useMemo } from 'react'
import createDecoratingHook, { DecoratingHook } from './decorated-js/react/createDecoratingHook'
import { ILazyImage, LazyImage } from './LazyImage'
import { LazyImageAfterPageLoadOptional } from './LazyImageAfterPageLoad'
import { LazyImageInVisibleArea } from './LazyImageInVisibleArea'
import { LazyImageWithWatchingVirtualSrc } from './LazyImageWithWatchingVirtualSrc'

const useLazyImageWithWatchingVirtualSrc = createDecoratingHook(LazyImageWithWatchingVirtualSrc)
const useLazyImageInVisibleArea = createDecoratingHook(LazyImageInVisibleArea)

export function useLazyImage(...props: ConstructorParameters<typeof LazyImage>) {
  return useMemo(() => {
    return new LazyImage(...props)
  }, props)
}

export const useLazyImageAfterPageLoad: DecoratingHook<typeof LazyImageAfterPageLoadOptional> = (
  ...props
) => {
  const lazyImage = useMemo(() => {
    return new LazyImageAfterPageLoadOptional(...props)
  }, props)

  return lazyImage
}

export function useCombinedLazy(): ILazyImage {
  return useLazyImageInVisibleArea(
    useLazyImageWithWatchingVirtualSrc(
      useLazyImageAfterPageLoad(true, useLazyImage(useMemo(() => ({ src: '' }), []))),
    ),
    useCallback(() => document.createElement('div'), []),
  )
}
