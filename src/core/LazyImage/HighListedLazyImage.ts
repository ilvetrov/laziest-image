/* eslint-disable no-plusplus */
import { UniqueDestroyable } from '../Destroyers/UniqueDestroyable'
import { IHighList, ReactiveHighList, HighList } from '../HighList/HighList'
import { ReactiveMiddleware } from '../Reactive/ReactiveMiddleware'
import { ILazyImage } from './LazyImage'

export const globalHighListOfLazyImage = ReactiveHighList(HighList<() => void>())

export function HighListedLazyImage(
  origin: ILazyImage,
  highList: IHighList<() => void> = globalHighListOfLazyImage,
): ILazyImage {
  const load = UniqueDestroyable(() => ({
    result: origin.load,
    destroy: highList.add(origin.load).remove,
  }))

  return {
    src: ReactiveMiddleware(
      origin.src,
      (value) => value,
      (value, changeValue) => {
        load.destroy()
        changeValue(value)
      },
    ),
    load() {
      load.run().result()
    },
    unload() {
      load.destroy()
      origin.unload()
    },
  }
}
