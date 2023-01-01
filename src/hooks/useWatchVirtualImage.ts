import { usePureHandlers } from 'pure-handlers/react'
import { useCallback, useEffect, useRef } from 'react'
import watchVirtualImage from '../core/watchVirtualImage'
import useEvent from './useEvent'

export type SetVirtualImage = (newVirtualImage: HTMLImageElement, initalSrc: string) => void

function useWatchVirtualImage(onChangeRaw: (newSrc: string) => void): SetVirtualImage {
  const onChange = useEvent(onChangeRaw)
  const virtualImage = useRef<HTMLImageElement>()
  const pureHandlers = usePureHandlers()

  const setVirtualImage: SetVirtualImage = useCallback((newVirtualImage, initialSrc) => {
    virtualImage.current = newVirtualImage
    addVirtualImageToWatcher(initialSrc)
  }, [])

  const addVirtualImageToWatcher = (initialSrc?: string) => {
    if (!virtualImage.current) {
      return undefined
    }

    pureHandlers.destroy()
    pureHandlers.addDestroyer(
      watchVirtualImage({ onChange, virtualImage: virtualImage.current, initialSrc }),
    )
  }

  useEffect(() => {
    addVirtualImageToWatcher()

    return pureHandlers.destroy()
  }, [])

  return setVirtualImage
}

export default useWatchVirtualImage
