import { useEffect, useMemo, useState } from 'react'
import { lazyImageProps, LazyImageProps } from '../core/LazyImageProps/LazyImageProps'
import { browserSupportsLazyLoading } from './browserSupportsLazyLoading'

export function useNativeProps(props: LazyImageProps): LazyImageProps {
  const [forceCustomLoading, setForceCustomLoading] = useState(false)

  useEffect(() => {
    if (!props.customLoading && !browserSupportsLazyLoading) {
      setForceCustomLoading(true)
    }
  }, [])

  return useMemo(
    () => ({
      ...props,
      customLoading: props.customLoading || forceCustomLoading,
    }),
    [...Object.values(lazyImageProps(props)), forceCustomLoading],
  )
}
