export type IDestroyer = () => void

export interface IDestroyers {
  add(destroyer: IDestroyer): IDestroyer
  destroyAll(): void
}

export class Destroyers implements IDestroyers {
  private readonly list = new Set<IDestroyer>()

  add(destroyer: IDestroyer): IDestroyer {
    this.list.add(destroyer)

    return destroyer
  }

  destroyAll(): void {
    this.list.forEach((destroyer) => destroyer())
    this.list.clear()
  }
}
