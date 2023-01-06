import { DependencyList, useCallback } from 'react'
import preloadImage from '../core/preloadImage'
import useEffectDestroyer from './useEffectDestroyer'

export default function usePreloadImage(deps: DependencyList): typeof preloadImage {
  const addDestroyer = useEffectDestroyer(deps)

  const preloadImageWrapped: typeof preloadImage = useCallback((props) => {
    const preloadingDestroyer = preloadImage(props)

    addDestroyer(preloadingDestroyer)

    return preloadingDestroyer
  }, [])

  return preloadImageWrapped
}
