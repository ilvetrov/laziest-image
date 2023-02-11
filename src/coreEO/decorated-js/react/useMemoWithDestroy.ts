import { DependencyList, useCallback, useEffect, useMemo, useRef } from 'react'
import { DecoratorFactory, decoratorFactoryToResult } from '../factory/DecoratorFactory'
import useDomMark from './useDomMark'
import useSyncedDomMark from './useSyncedDomMark'

type UseMemoWithDestroyFactory<T> = DecoratorFactory<T, { destroy(): void }>

function useMemoWithDestroyFactory<T>(
  callback: (onDestroy: (destroyer: () => void) => void) => T,
  deps: DependencyList,
): UseMemoWithDestroyFactory<T> {
  const destroyers = useRef(new Set<() => void>())
  const destroyAll = useCallback(() => {
    destroyers.current.forEach((destroyer) => destroyer())
    destroyers.current.clear()
  }, [])

  const result = useMemo(() => {
    if (destroyers.current.size > 0) {
      destroyAll()
    }

    return callback((destroyer) => destroyers.current.add(destroyer))
  }, deps)

  return {
    result,
    destroy() {
      destroyAll()
    },
  }
}

export const useMemoWithDestroy = decoratorFactoryToResult(useMemoWithDestroyFactory)

function useMemoWithDestroyAndOnUnmountFactory<T>(
  callback: (onDestroy: (destroyer: () => void) => void) => T,
  deps: DependencyList,
): UseMemoWithDestroyFactory<T> {
  const { currentDomMark } = useSyncedDomMark(useDomMark())
  const { result, destroy } = useMemoWithDestroyFactory(callback, [currentDomMark, ...deps])

  useEffect(() => {
    return () => {
      destroy()
    }
  }, [])

  return {
    result,
    destroy,
  }
}

export const useMemoWithDestroyAndOnUnmount = decoratorFactoryToResult(
  useMemoWithDestroyAndOnUnmountFactory,
)
