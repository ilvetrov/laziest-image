import { DependencyList, useEffect, useMemo, useRef } from 'react'
import useForceRender from '../useForceRender'
import { IDecoratedToReact } from './DecoratedReact'
import useStateWithDeps from './hooks/useStateWithDeps'

export default function useDecoratedToReact<T>(
  initCallback: () => IDecoratedToReact<T>,
  deps: DependencyList,
) {
  const [renderOnNewDom, currentDomMark] = useForceRender()
  const decoratedToReact = useMemo(() => initCallback(), [...deps, currentDomMark])
  const [value, setValue] = useStateWithDeps(
    () => decoratedToReact.reactiveValue(),
    [...deps, currentDomMark],
  )
  const didDestroy = useRef(false)

  decoratedToReact.addRender(setValue)

  useEffect(() => {
    if (didDestroy.current && decoratedToReact.valueDependsOnEffects()) {
      didDestroy.current = false
      renderOnNewDom()

      return undefined
    }

    decoratedToReact.callEffects()

    return () => {
      didDestroy.current = true
      decoratedToReact.callDestroyers()
    }
  }, [...deps, currentDomMark])

  return value
}
