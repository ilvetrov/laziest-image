import { Destroyable, IDestroyable, IDestroyableOrigin } from './Destroyable'

export function UniqueDestroyable<T extends IDestroyableOrigin>(origin: T): IDestroyable<T> {
  const destroyable = Destroyable(origin)

  return {
    run(...args) {
      destroyable.destroy()

      return destroyable.run(...args)
    },
    destroy: destroyable.destroy,
  }
}
