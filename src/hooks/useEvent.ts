import { useCallback, useRef } from 'react'

export default function useEvent<Args extends unknown[], Result = void>(
  handler: (...args: Args) => Result,
): (...args: Args) => Result {
  const handlerRef = useRef<(...args: Args) => Result>(handler)

  handlerRef.current = handler

  return useCallback((...args) => handlerRef.current(...args), [])
}
