import { ControlledReactive } from '../Reactive/ControlledReactive'
import { IReactive, Reactive } from '../Reactive/Reactive'
import { ISrc } from '../Src/Src'

export interface ILazyImage {
  src(): IReactive<ISrc>
  load(): void
  unload(): void
}

export function LazyImage(finalSrc: ISrc, initSrc: ISrc): ILazyImage {
  const controlledSrc = ControlledReactive(initSrc)
  const uncontrolledSrc = Reactive(controlledSrc)

  return {
    src: () => uncontrolledSrc,
    load() {
      controlledSrc.changeValue(finalSrc)
    },
    unload() {
      controlledSrc.unsubscribeAll()
      controlledSrc.changeValue(initSrc)
    },
  }
}
