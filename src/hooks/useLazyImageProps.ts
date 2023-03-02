import { LazyImageProps, lazyImageProps } from '../core/LazyImageProps/LazyImageProps'
import { omitObject } from '../core/Props/omitObject'
import { useStableCallbacksIn } from './useStableCallback'

export function useLazyImageProps<
  InputProps extends LazyImageProps & Record<string | number | symbol, any>,
>(userProps: InputProps): [LazyImageProps, Omit<InputProps, keyof LazyImageProps>] {
  const ownProps = lazyImageProps({
    ...userProps,
    ...useStableCallbacksIn({
      onLoad: userProps.onLoad,
      onFirstLoad: userProps.onFirstLoad,
      onSrcChange: userProps.onSrcChange,
    }),
  })
  const restProps = omitObject(
    userProps,
    Object.keys(ownProps) as ReadonlyArray<keyof typeof ownProps>,
  )

  return [ownProps, restProps]
}
