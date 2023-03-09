import { useCallback, useRef } from 'react'

type IUnstableCallback = ((...args: any) => any) | null | undefined | void

type ExistingValue<T> = Exclude<T, undefined | null | void>

type NullToUndefined<T> = null extends T ? Exclude<T, null> | undefined : T

export type IStableCallback<T extends IUnstableCallback> = undefined extends NullToUndefined<T>
  ? undefined extends ReturnType<ExistingValue<T>>
    ? ExistingValue<T>
    : (...args: Parameters<ExistingValue<T>>) => ReturnType<ExistingValue<T>> | undefined
  : T

export function useStableCallback<Callback extends IUnstableCallback>(callback?: Callback) {
  const ref = useRef(callback)

  ref.current = callback

  return useCallback((...args: unknown[]) => {
    return ref.current?.(...args)
  }, []) as IStableCallback<Callback>
}

export function useStableCallbacks<Callbacks extends IUnstableCallback[]>(...callbacks: Callbacks) {
  const initNumberOfCallbacks = useRef(callbacks.length)

  if (initNumberOfCallbacks.current !== callbacks.length) {
    throw new Error('Provide a stable number of callbacks')
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return callbacks.map((callback) => useStableCallback(callback)) as {
    [Key in keyof Callbacks]: IStableCallback<Callbacks[Key]>
  }
}

export function useStableCallbacksIn<Callbacks extends Record<string | symbol, IUnstableCallback>>(
  callbacks: Callbacks,
) {
  const currentLength = Object.keys(callbacks).length
  const initNumberOfCallbacks = useRef(currentLength)

  if (initNumberOfCallbacks.current !== currentLength) {
    throw new Error('Provide a stable number of callbacks')
  }

  const stableCallbacks: Record<string | symbol, IUnstableCallback> = {}

  Object.keys(callbacks)
    .sort()
    .forEach((key) => {
      const callback = callbacks[key]

      // eslint-disable-next-line react-hooks/rules-of-hooks
      stableCallbacks[key] = useStableCallback(callback)
    })

  return stableCallbacks as {
    [Key in keyof Callbacks]: IStableCallback<Callbacks[Key]>
  }
}
