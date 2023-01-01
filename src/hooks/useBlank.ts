import { useMemo } from 'react'
import { createBlank } from '../core/blank'
import { ImageProps, ImagePropsWithDefault } from '../core/ImageProps'

export type Blank = string

export default function useBlank(
  width: ImagePropsWithDefault<ImageProps>['width'],
  height: ImagePropsWithDefault<ImageProps>['height'],
  doNotCreateBlank: ImagePropsWithDefault<ImageProps>['doNotCreateBlank'],
): Blank | undefined {
  return useMemo(() => {
    if (!doNotCreateBlank && width && height) {
      return createBlank(width, height)
    }
  }, [width, height, doNotCreateBlank])
}
