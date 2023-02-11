import { MutableRefObject, useEffect, useRef } from 'react'

function newDomMark(): symbol {
  return Symbol('domMark')
}

export interface UseDomMark {
  currentDomMark: symbol
  newestDomMark: MutableRefObject<symbol>
}

/**
 * If render happens after remount, symbol will be different
 */
export default function useDomMark(): UseDomMark {
  const newestDomMark = useRef(newDomMark())
  const currentDomMark = newestDomMark.current

  useEffect(() => {
    return () => {
      newestDomMark.current = newDomMark()
    }
  }, [])

  return { currentDomMark, newestDomMark }
}
