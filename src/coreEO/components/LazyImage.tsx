import React, { forwardRef, memo, useRef } from 'react'
import { browserSupportsLazyLoading } from '../../core/browserSupportsLazyLoading'
import useCombinedRef from '../../hooks/useCombinedRef'
import { ClientOnlyDynamicImage } from '../ClientOnlyDynamicImage'
import { DecoratedToReact } from '../decorated-react/DecoratedReact'
import { DynamicImage, IDynamicImage } from '../DynamicImage'
import { Image } from '../Image'
import { ImageAfterPageLoad } from '../ImageAfterPageLoad'
import { ImageProps } from '../ImageProps'
import { ImageWaitInVisibleArea } from '../ImageWaitInVisibleArea'
import { ManualLoadedDynamicImage } from '../ManualLoadedDynamicImage'
import { useDynamicImage2 } from '../useDynamicImage'

interface LazyImageProps
  extends ImageProps,
    Omit<
      React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
      keyof ImageProps | 'children'
    > {}

const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>(
  (
    {
      src,
      srcSet,
      sizes,
      width,
      height,
      canLoad,
      afterPageLoad,
      customLoading,
      onLoad,
      onFirstLoad,
      onSrcChange,
      ...rest
    },
    parentRef,
  ) => {
    const ref = useCombinedRef(parentRef)
    const { readySrc, loaded } = useDynamicImage2(() => {
      return new DecoratedToReact((lifetime) => {
        let dynamicImage: IDynamicImage = new DynamicImage(new Image(src))

        if (customLoading || !browserSupportsLazyLoading) {
          dynamicImage = new ImageWaitInVisibleArea(
            dynamicImage,
            () => ref.current!,
            customLoading?.yOffset,
            customLoading?.xOffset,
          )
        }

        dynamicImage = new ClientOnlyDynamicImage(
          dynamicImage,
          customLoading || afterPageLoad
            ? { loaded: false, readySrc: '' }
            : { loaded: true, readySrc: src },
        )

        if (afterPageLoad) {
          dynamicImage = new ImageAfterPageLoad(dynamicImage)
        }

        if (canLoad) {
          dynamicImage = new ManualLoadedDynamicImage(dynamicImage, canLoad)
        }

        dynamicImage.status().subscribe((newStatus) => lifetime.render(newStatus))
        lifetime.onDestroy(() => dynamicImage.destroy())

        if (customLoading || !browserSupportsLazyLoading) {
          lifetime.onEffect(() => dynamicImage.load())
        } else {
          dynamicImage.load()
        }

        return dynamicImage.status().get()
      })
    }, [src, srcSet, sizes, canLoad, afterPageLoad, customLoading])

    const didFirstLoad = useRef(false)

    return (
      <img
        src={readySrc}
        srcSet={loaded ? srcSet : undefined}
        sizes={sizes}
        width={width}
        height={height}
        ref={ref}
        onLoad={() => {
          if (!ref.current?.currentSrc) {
            return
          }

          if (onLoad) {
            onLoad(ref.current.currentSrc)
          }

          if (onSrcChange && didFirstLoad.current) {
            onSrcChange(ref.current.currentSrc)
          }

          if (onFirstLoad && !didFirstLoad.current) {
            didFirstLoad.current = true
            onFirstLoad(ref.current.currentSrc)
          }
        }}
        loading={rest.loading ?? 'lazy'}
      />
    )
  },
)

export default memo(LazyImage)
