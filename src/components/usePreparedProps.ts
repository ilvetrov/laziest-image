import { LazyImageProps } from '../core/LazyImageProps/LazyImageProps'
import { useStableCallbacksIn } from '../hooks/useStableCallback'

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
