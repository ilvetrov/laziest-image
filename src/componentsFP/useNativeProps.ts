import { useEffect, useMemo, useState } from 'react'
import { If } from '../coreFP/If'
import { browserSupportsLazyLoading } from './browserSupportsLazyLoading'
import { LazyImageProps } from './LazyImageProps'

export function useNativeProps(props: LazyImageProps): LazyImageProps {
  const [overrideNative, setOverrideNative] = useState(false)

  useEffect(() => {
    if (!props.customLoading && !browserSupportsLazyLoading) {
      setOverrideNative(true)
    }
  }, [])

  return useMemo(
    () => ({
      ...props,
      customLoading: If(
        props.customLoading,
        { withoutWatchingSrcChange: true },
        props.customLoading || !overrideNative,
      ),
    }),
    [...Object.values(props), overrideNative],
  )
}
