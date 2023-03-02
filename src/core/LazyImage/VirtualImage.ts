import PureHandlers from 'pure-handlers'
import { UniqueDestroyers } from '../Destroyers/UniqueDestroyers'
import { ControlledReactive } from '../Reactive/ControlledReactive'
import { Reactive } from '../Reactive/Reactive'
import { ISrc } from '../Src/Src'
import { ILazyImage } from './LazyImage'

export function VirtualImage(src: ISrc, keepWatching = false): ILazyImage {
  const controlledSrc = ControlledReactive<ISrc>({ ...src, loaded: false })
  const uncontrolledSrc = Reactive(controlledSrc)
  const destroyers = UniqueDestroyers()

  return {
    src: () => uncontrolledSrc,
    load() {
      const pureHandlers = new PureHandlers()

      const virtualImage = new Image()

      virtualImage.decoding = 'async'

      pureHandlers.addEventListener(virtualImage, 'load', () => {
        controlledSrc.changeValue({
          ...src,
          src: keepWatching ? virtualImage.currentSrc : src.src,
          loaded: true,
        })

        if (!keepWatching) {
          pureHandlers.destroy()
        }
      })
      ;['abort', 'error', 'suspend'].forEach((eventName) => {
        pureHandlers.addEventListener(virtualImage, eventName, () => {
          throw new Error(`Image not loaded`)
        })
      })

      if (src.sizes) {
        virtualImage.sizes = src.sizes
      }

      if (src.srcSet) {
        virtualImage.srcset = src.srcSet
      }

      virtualImage.src = src.src

      destroyers.add('load', () => {
        pureHandlers.destroy()
        virtualImage.src = ''
        virtualImage.srcset = ''
        virtualImage.sizes = ''
      })
    },
    unload() {
      controlledSrc.unsubscribeAll()
      controlledSrc.clear()
      destroyers.destroyAll()
    },
  }
}
