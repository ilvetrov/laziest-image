import { ForwardedRef, MutableRefObject, useRef } from 'react'
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'

export default function useCombinedRef<T>(...refs: (MutableRefObject<T> | ForwardedRef<T>)[]) {
  const combinedRef = useRef<T>(null)

  useIsomorphicLayoutEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return

      if (typeof ref === 'function') {
        ref(combinedRef.current)
      } else {
        ref.current = combinedRef.current
      }
    })
    // we need to run the effect on every update so we don't need dependencies
  })

  return combinedRef
}
