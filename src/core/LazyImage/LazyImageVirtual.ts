import { UniqueDestroyers } from '../Destroyers/UniqueDestroyers'
import { preloadImage } from '../preloadImage'
import { ControlledReactive } from '../Reactive/ControlledReactive'
import { Reactive } from '../Reactive/Reactive'
import { LoadedSrc } from '../Src/LoadedSrc'
import { ISrc } from '../Src/Src'
import { ILazyImage } from './LazyImage'

export function LazyImageVirtual(finalSrc: ISrc, initSrc: ISrc): ILazyImage {
  const controlledSrc = ControlledReactive(initSrc)
  const uncontrolledSrc = Reactive(controlledSrc)
  const destroyers = UniqueDestroyers()

  return {
    src: () => uncontrolledSrc,
    load() {
      destroyers.add(
        'load',
        preloadImage({
          src: finalSrc,
          onLoad: (newSrc) => {
            controlledSrc.changeValue(LoadedSrc(newSrc))
          },
          keepWatching: true,
        }),
      )
    },
    unload() {
      controlledSrc.unsubscribeAll()
      destroyers.destroyAll()
      controlledSrc.clear()
    },
  }
}
