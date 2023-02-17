import { useRef } from 'react'

export function useOnLoadListeners(
  newSrc: () => string | undefined,
  onLoad?: (src: string) => void,
  onFirstLoad?: (src: string) => void,
  onSrcChange?: (src: string) => void,
) {
  const didFirstLoad = useRef(false)

  return () => {
    const src = newSrc()

    if (!src) {
      return
    }

    onLoad?.(src)

    if (didFirstLoad.current) {
      onSrcChange?.(src)
    }

    if (!didFirstLoad.current) {
      didFirstLoad.current = true
      onFirstLoad?.(src)
    }
  }
}

export function useOnLoadListenersOnlyOnLoaded(origin: () => void, loaded: boolean) {
  return () => {
    if (loaded) {
      origin()
    }
  }
}
