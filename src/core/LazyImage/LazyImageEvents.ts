import { onLoadListeners } from '../../components/useOnLoadListeners'
import { IOneMemory, OneMemory } from '../Memory/OneMemory'
import { ReactiveMiddleware } from '../Reactive/ReactiveMiddleware'
import { ILazyImage } from './LazyImage'

export function LazyImageEvents(
  origin: ILazyImage,
  onLoad?: (src: string) => void,
  onFirstLoad?: (src: string) => void,
  onSrcChange?: (src: string) => void,
  didFirstLoadFromUser?: IOneMemory<boolean>,
): ILazyImage {
  const didFirstLoad = didFirstLoadFromUser ?? OneMemory(false)

  function callOnFirstLoad(newSrc: string) {
    didFirstLoad.write(true)

    onFirstLoad?.(newSrc)
  }

  return {
    load: origin.load,
    unload: origin.unload,
    src: () =>
      ReactiveMiddleware(
        origin.src(),
        (src) => src,
        (src) => {
          onLoadListeners(
            () => src.src,
            () => didFirstLoad.read(),
            onLoad,
            callOnFirstLoad,
            onSrcChange,
          )

          return src
        },
      ),
  }
}
