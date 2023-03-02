import { useMemo } from 'react'

export default function useAutoMemo<T extends Record<string | number | symbol, any>>(object: T): T {
  return useMemo(() => object, Object.values(object))
}
