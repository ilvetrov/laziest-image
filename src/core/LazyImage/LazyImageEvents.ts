import { onLoadListeners } from '../../components/useOnLoadListeners'
import { IMemory, Memory } from '../Memory/Memory'
import { ReactiveMiddleware } from '../Reactive/ReactiveMiddleware'
import { ILazyImage } from './LazyImage'

export function LazyImageEvents(
  origin: ILazyImage,
  onLoad?: (src: string) => void,
  onFirstLoad?: (src: string) => void,
  onSrcChange?: (src: string) => void,
  didFirstLoadFromUser?: IMemory<boolean>,
): ILazyImage {
  const didFirstLoad = didFirstLoadFromUser ?? Memory(false)

  function callOnFirstLoad(newSrc: string) {
    didFirstLoad.write(true)

    onFirstLoad?.(newSrc)
  }

  return {
    load: origin.load,
    unload: origin.unload,
    src: ReactiveMiddleware(
      origin.src,
      (src) => src,
      (src, changeValue) => {
        onLoadListeners(
          () => src.src,
          () => didFirstLoad.read(),
          onLoad,
          callOnFirstLoad,
          onSrcChange,
        )

        changeValue(src)
      },
    ),
  }
}
