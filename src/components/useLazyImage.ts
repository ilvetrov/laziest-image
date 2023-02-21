import { MutableRefObject, useMemo } from 'react'
import { ILazyImage } from '../core/LazyImage/LazyImage'
import { LazyImagePool } from '../core/LazyImage/Pool/LazyImagePool'
import { OneMemory } from '../core/Memory/OneMemory'
import { NonNullable } from '../core/NonNullable/NonNullable'
import { LazyImageProps } from './LazyImageProps'

export function useLazyImage(
  ref: MutableRefObject<HTMLElement | null>,
  props: LazyImageProps,
): ILazyImage {
  const didFirstLoad = useMemo(() => OneMemory(false), [])

  return useMemo(() => {
    return LazyImagePool({ ...props, element: () => NonNullable(ref.current), didFirstLoad })
  }, Object.values(props))
}
