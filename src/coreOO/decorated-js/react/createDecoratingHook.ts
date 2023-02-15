import { useMemo } from 'react'

export type DecoratingHook<T extends new (...args: any) => any> = (
  ...props: ConstructorParameters<T>
) => InstanceType<T>

export default function createDecoratingHook<T extends new (...args: any) => any>(
  Decorator: T,
): DecoratingHook<T> {
  return function useDecoratingHook(...props: ConstructorParameters<T>) {
    return useMemo(() => {
      return new Decorator(...props)
    }, props)
  }
}
