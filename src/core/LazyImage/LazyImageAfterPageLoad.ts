import { AfterPageLoad } from '../Action/AfterPageLoad'
import { OnlyDestroyer } from '../Destroyers/Destroyable'
import { UniqueDestroyable } from '../Destroyers/UniqueDestroyable'
import { ILazyImage } from './LazyImage'

export function LazyImageAfterPageLoad(origin: ILazyImage): ILazyImage {
  const load = UniqueDestroyable(OnlyDestroyer(AfterPageLoad(origin.load)))

  return {
    src: origin.src,
    load() {
      load.run()
    },
    unload() {
      load.destroy()
      origin.unload()
    },
  }
}
