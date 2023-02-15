import { useMemo } from 'react'

export default function useOnce<T>(value: T): T {
  return useMemo(() => value, [])
}
