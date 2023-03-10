type Destroyer = () => void

export interface IDestroyers {
  add(destroyer: Destroyer): void
  destroyAll(): void
}

export function Destroyers(): IDestroyers {
  const destroyers = new Set<Destroyer>()

  return {
    add: (destroyer) => destroyers.add(destroyer),
    destroyAll() {
      destroyers.forEach((destroyer) => destroyer())
      destroyers.clear()
    },
  }
}
