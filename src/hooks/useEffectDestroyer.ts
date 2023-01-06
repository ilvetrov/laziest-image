import { DependencyList, useCallback, useEffect, useRef } from 'react'

type Destroyer = () => void
type AddDestroyer = (destroyer: Destroyer) => void

export default function useEffectDestroyer(deps: DependencyList): AddDestroyer {
  const destroyers = useRef(new Set<Destroyer>())

  useEffect(() => {
    return () => {
      destroyers.current.forEach((destroyer) => destroyer())
      destroyers.current.clear()
    }
  }, deps)

  const addDestroyer: AddDestroyer = useCallback((destroyer) => {
    destroyers.current.add(destroyer)
  }, [])

  return addDestroyer
}
