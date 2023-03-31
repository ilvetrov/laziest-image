type Destroyer = () => void

export interface IUniqueDestroyers {
  add(name: any, destroyer: Destroyer): Destroyer
  destroyAll(): void
}

export function UniqueDestroyers(): IUniqueDestroyers {
  const destroyers = new Map<any, Destroyer>()

  return {
    add: (name, destroyer) => {
      destroyers.get(name)?.()
      destroyers.set(name, destroyer)

      return destroyer
    },
    destroyAll() {
      destroyers.forEach((destroyer) => destroyer())
      destroyers.clear()
    },
  }
}
