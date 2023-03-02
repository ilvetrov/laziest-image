/* eslint-disable @typescript-eslint/ban-types */
import { useCallback, useMemo, useRef } from 'react'

export function useStableCallback<Callback extends (...args: any) => any>(
  callback?: Callback,
): NonNullable<Callback> {
  const ref = useRef(callback)

  ref.current = callback

  return useCallback((...args: Parameters<Callback>) => {
    return ref.current?.(...args)
  }, []) as Callback
}

export function useStableCallbacks<Callbacks extends (undefined | ((...args: any) => any))[]>(
  ...callbacks: Callbacks
) {
  const initNumberOfCallbacks = useRef(callbacks.length)

  if (initNumberOfCallbacks.current !== callbacks.length) {
    throw new Error('Provide a stable number of callbacks')
  }

  const stableCallbacks: unknown[] = []

  for (let i = 0; i < callbacks.length; i++) {
    const callback = callbacks[i]

    // eslint-disable-next-line react-hooks/rules-of-hooks
    stableCallbacks[i] = useStableCallback(callback)
  }

  return stableCallbacks as {
    [Key in keyof Callbacks]: NonNullable<Callbacks[Key]>
  }
}

export function useStableCallbacksIn<
  Callbacks extends Record<string | number | symbol, undefined | ((...args: any) => any)>,
>(callbacks: Callbacks) {
  const currentLength = Object.keys(callbacks).length
  const initNumberOfCallbacks = useRef(currentLength)

  if (initNumberOfCallbacks.current !== currentLength) {
    throw new Error('Provide a stable number of callbacks')
  }

  const stableCallbacks: Record<string | number | symbol, (...args: any) => any> = {}

  Object.keys(callbacks).forEach((key) => {
    const callback = callbacks[key]

    // eslint-disable-next-line react-hooks/rules-of-hooks
    stableCallbacks[key] = useStableCallback(callback)
  })

  return stableCallbacks as {
    [Key in keyof Callbacks]: NonNullable<Callbacks[Key]>
  }
}

export function useStableObject<
  T extends Record<string | number | symbol, any>,
  FunctionNames extends ReadonlyArray<keyof T>,
>(
  object: T,
  functions: FunctionNames,
): Omit<T, FunctionNames[number]> & {
  [Key in FunctionNames[number]]: ((...args: any) => any) extends T[Key]
    ? (
        ...args: Parameters<NonNullable<T[Key]>>
      ) => undefined extends T[Key]
        ? ReturnType<NonNullable<T[Key]>> | undefined
        : null extends T[Key]
        ? ReturnType<NonNullable<T[Key]>> | null
        : ReturnType<NonNullable<T[Key]>>
    : () => T[Key]
} {
  const currentObject = useRef(object)

  currentObject.current = object

  return useMemo(() => {
    const output: Record<string | number | symbol, any> = { ...object }

    functions.forEach((key) => {
      output[key] = (...args: unknown[]) => {
        if (typeof currentObject.current[key] === 'function') {
          return currentObject.current[key]?.(...args)
        }

        return currentObject.current[key]
      }
    })

    return output as any
  }, [])
}
