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
      const virtualImage = new Image()

      virtualImage.decoding = 'async'

      function loadHandler() {
        controlledSrc.changeValue({
          ...src,
          src: keepWatching ? virtualImage.currentSrc : src.src,
          loaded: true,
        })

        if (!keepWatching) {
          virtualImage.removeEventListener('load', loadHandler)
        }
      }

      virtualImage.addEventListener('load', loadHandler)
      destroyers.add('loadEvent', () => virtualImage.removeEventListener('load', loadHandler))
      //
      ;['abort', 'error', 'suspend'].forEach((eventName) => {
        function errorHandler() {
          throw new Error(`Image not loaded`)
        }

        virtualImage.addEventListener(eventName, errorHandler)
        destroyers.add(`errorEvent_${eventName}`, () =>
          virtualImage.removeEventListener(eventName, errorHandler),
        )
      })

      if (src.sizes) {
        virtualImage.sizes = src.sizes
      }

      if (src.srcSet) {
        virtualImage.srcset = src.srcSet
      }

      virtualImage.src = src.src

      destroyers.add('src', () => {
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
