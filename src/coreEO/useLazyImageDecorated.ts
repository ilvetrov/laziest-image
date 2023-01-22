import { useMemo } from 'react'
import { BlankOnEmptyLazyImage } from './BlankOnEmptyLazyImage'
import _ from './decorated-js/OptionalDecorator'
import { ImageSrcData, LazyImage } from './LazyImage'
import { LazyImageAfterPageLoad } from './LazyImageAfterPageLoad'
import { LazyImageInVisibleArea } from './LazyImageInVisibleArea'
import { LazyImageProps } from './LazyImageProps'
import useSrcData from './useSrcData'

export default function useLazyImageDecorated(props: LazyImageProps): ImageSrcData {
  return useSrcData(
    useMemo(() => {
      return _(
        LazyImageAfterPageLoad,
        _(
          LazyImageInVisibleArea,
          _(
            BlankOnEmptyLazyImage,
            new LazyImage({
              src: props.src,
              srcSet: props.srcSet,
              sizes: props.sizes,
            }),
            Boolean(!props.customLoading?.withoutBlank && props.width && props.height),
            Number(props.width),
            Number(props.height),
          ),
          Boolean(props.customLoading),
          () => props.customLoading!.element,
        ),
        Boolean(props.afterPageLoad),
      )
    }, Object.values(props)),
  )
}
