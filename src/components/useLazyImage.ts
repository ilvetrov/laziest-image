import { MutableRefObject, useMemo } from 'react'
import { LazyImageByProps } from '../core'
import { ILazyImage } from '../core/LazyImage/LazyImage'
import { lazyImageProps, LazyImageProps } from '../core/LazyImageProps/LazyImageProps'
import { Memory } from '../core/Memory/Memory'
import { NonNullableValue } from '../core/NonNullable/NonNullableValue'

export function useLazyImage(
  ref: MutableRefObject<HTMLElement | null>,
  props: LazyImageProps,
): ILazyImage {
  const didFirstLoad = useMemo(() => Memory(false), [])

  return useMemo(
    () => LazyImageByProps(props, () => NonNullableValue(ref.current), didFirstLoad),
    Object.values(lazyImageProps(props)),
  )
}
