import { DependencyList, MutableRefObject, useEffect, useRef } from 'react'

function newDomMark(): symbol {
  return Symbol('domMark')
}

export interface UseDomMark {
  currentDomMark: symbol
  newestDomMark: MutableRefObject<symbol>
}

export default function useDomMark(deps: DependencyList = []): UseDomMark {
  const newestDomMark = useRef(newDomMark())
  const currentDomMark = newestDomMark.current

  useEffect(() => {
    return () => {
      newestDomMark.current = newDomMark()
    }
  }, deps)

  return { currentDomMark, newestDomMark }
}
