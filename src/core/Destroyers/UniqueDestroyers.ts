type Destroyer = () => void

export interface IUniqueDestroyers {
  add(name: any, destroyer: Destroyer): void
  destroyAll(): void
}

export function UniqueDestroyers(): IUniqueDestroyers {
  const destroyers = new Map<any, Destroyer>()

  return {
    add: (name, destroyer) => {
      destroyers.get(name)?.()
      destroyers.set(name, destroyer)
    },
    destroyAll() {
      destroyers.forEach((destroyer) => destroyer())
      destroyers.clear()
    },
  }
}
