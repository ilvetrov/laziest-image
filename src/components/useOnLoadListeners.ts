import { useRef } from 'react'

export function onLoadListeners(
  newSrc: () => string | undefined,
  didFirstLoad: () => boolean,
  onLoad?: (src: string) => void,
  onFirstLoad?: (src: string) => void,
  onSrcChange?: (src: string) => void,
) {
  const src = newSrc()

  if (!src) {
    return
  }

  onLoad?.(src)

  if (didFirstLoad()) {
    onSrcChange?.(src)
  }

  if (!didFirstLoad()) {
    onFirstLoad?.(src)
  }
}

export function useOnLoadListeners(
  newSrc: () => string | undefined,
  onLoad?: (src: string) => void,
  onFirstLoad?: (src: string) => void,
  onSrcChange?: (src: string) => void,
) {
  const didFirstLoad = useRef(false)

  return () => {
    onLoadListeners(
      newSrc,
      () => didFirstLoad.current,
      onLoad,
      (src) => {
        didFirstLoad.current = true
        onFirstLoad?.(src)
      },
      onSrcChange,
    )
  }
}

export function useOnLoadListenersOnlyOnLoaded(origin: () => void, loaded: boolean) {
  return () => {
    if (loaded) {
      origin()
    }
  }
}
