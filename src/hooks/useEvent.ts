import { useCallback, useRef } from 'react'

export function useEvent<Args extends unknown[], Result = void>(
  handler: (...args: Args) => Result,
): (...args: Args) => Result {
  const handlerRef = useRef<(...args: Args) => Result>(handler)

  handlerRef.current = handler

  return useCallback((...args) => handlerRef.current(...args), [])
}

export function useEventOptional<Args extends unknown[], Result = void>(
  handler?: (...args: Args) => Result,
): (...args: Args) => Result | void {
  const handlerRef = useRef<((...args: Args) => Result) | undefined>(handler)

  handlerRef.current = handler

  return useCallback((...args) => {
    if (handlerRef.current) {
      return handlerRef.current(...args)
    }
  }, [])
}
