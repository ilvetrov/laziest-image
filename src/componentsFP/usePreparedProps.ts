import { useStableCallbacksIn } from '../hooks/useStableCallback'
import { LazyImageProps } from './LazyImageProps'

export function usePreparedProps(rawProps: LazyImageProps): LazyImageProps {
  return {
    ...rawProps,
    ...useStableCallbacksIn({
      onLoad: rawProps.onLoad,
      onFirstLoad: rawProps.onFirstLoad,
      onSrcChange: rawProps.onSrcChange,
    }),
  }
}
