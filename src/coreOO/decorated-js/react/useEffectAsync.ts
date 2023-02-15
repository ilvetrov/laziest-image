import { useEffect, DependencyList } from 'react'
import { Destroyers } from '../Destroyers'

type Destroyer = () => void

export default function useEffectAsync(
  callback: (
    onDestroy: (destroyer: Destroyer) => void,
    destroyed: { current: boolean },
  ) => Promise<void> | void,
  deps: DependencyList,
) {
  useEffect(() => {
    const destroyers = new Destroyers()
    const destroyed = { current: false }

    destroyers.add(() => (destroyed.current = true))

    callback((destroyer) => destroyers.add(destroyer), destroyed)

    return () => destroyers.destroyAll()
  }, deps)
}
