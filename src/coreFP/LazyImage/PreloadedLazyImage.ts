import { UniqueDestroyers } from '../Destroyers/UniqueDestroyers'
import { preloadImage } from '../preloadImage'
import { ILazyImage } from './LazyImage'

export function PreloadedLazyImage(origin: ILazyImage): ILazyImage {
  const destroyers = UniqueDestroyers()

  return {
    src: origin.src,
    load() {
      destroyers.add(
        'load',
        preloadImage(origin.src().current(), () => origin.load()),
      )
    },
    unload() {
      destroyers.destroyAll()
      origin.unload()
    },
  }
}
