import { AfterPageLoad } from '../Action/AfterPageLoad'
import { UniqueDestroyers } from '../Destroyers/UniqueDestroyers'
import { ILazyImage } from './LazyImage'

export function LazyImageAfterPageLoad(origin: ILazyImage): ILazyImage {
  const destroyers = UniqueDestroyers()

  return {
    src: origin.src,
    load() {
      destroyers.add('load', AfterPageLoad(origin.load)())
    },
    unload() {
      destroyers.destroyAll()
      origin.unload()
    },
  }
}
