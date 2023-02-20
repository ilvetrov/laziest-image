import { useMemo } from 'react'

export function useAsHook<Func extends (...args: any) => any>(
  func: Func,
  ...args: Parameters<Func>
): ReturnType<Func> {
  return useMemo(() => func(...args), [func, ...args])
}
