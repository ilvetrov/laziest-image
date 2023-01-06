import { MutableRefObject, useCallback } from 'react'
import { getImagePropsToUpdateAll, ImageProps, ImageStatus } from '../core/ImageProps'
import useLazyImageStatus from './useLazyImageStatus'
import usePreloadImage from './usePreloadImage'
import useWaitInVisibleArea from './useWaitInVisibleArea'

export default function useLazyImage(
  ref: MutableRefObject<HTMLElement | null>,
  props: ImageProps,
): ImageStatus {
  const { readySrc, loaded, setImageStatus } = useLazyImageStatus(props)

  const preloadImage = usePreloadImage(getImagePropsToUpdateAll(props))

  useWaitInVisibleArea(
    ref,
    props,
    useCallback(() => {
      let firstLoad = true

      preloadImage({
        src: props.src,
        srcSet: props.srcSet,
        sizes: props.sizes,
        keepWatching: props.customLoading && !props.customLoading.withoutWatchingSrcChange,
        onLoad(loadedSrc) {
          setImageStatus({
            readySrc: loadedSrc,
            loaded: true,
          })

          if (props.onLoad) {
            props.onLoad(loadedSrc)
          }

          if (props.onFirstLoad && firstLoad) {
            props.onFirstLoad(loadedSrc)
          }

          if (props.onSrcChange && !firstLoad) {
            props.onSrcChange(loadedSrc)
          }

          firstLoad = false
        },
      })
    }, getImagePropsToUpdateAll(props)),
  )

  return { readySrc, loaded }
}
