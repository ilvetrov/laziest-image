import { useEffect } from 'react'
import { UseDomMark } from './useDomMark'
import useForceRender from './useForceRender'

/**
 * Sync domMark in ref and state to one value via new render
 */
export default function useSyncedDomMark(props: UseDomMark): UseDomMark {
  const [render] = useForceRender()

  useEffect(() => {
    if (props.currentDomMark !== props.newestDomMark.current) {
      render()
    }
  }, [])

  return props
}
