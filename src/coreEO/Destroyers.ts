import cached from './cached'
import { CachedKey } from './CachedKey'

export type IDestroyer = () => void

export interface IDestroyers {
  add(destroyer: IDestroyer): IDestroyer
  destroyAll(): void
}

export class Destroyers implements IDestroyers {
  private readonly list = cached(() => new Set<IDestroyer>())

  private readonly userCachedDestroyers = cached(() => new CachedKey<IDestroyer>())

  private generateDestroyer(userDestroyer: () => void): IDestroyer {
    return this.userCachedDestroyers().get(userDestroyer, () => {
      const innerDestroyer = () => {
        userDestroyer()
        this.list().delete(innerDestroyer)
      }

      return innerDestroyer
    })
  }

  add(userDestroyer: () => void): IDestroyer {
    const destroyer = this.generateDestroyer(userDestroyer)

    this.list().add(destroyer)

    return destroyer
  }

  destroyAll(): void {
    this.list().forEach((destroyer) => destroyer())
    this.list().clear()
  }
}
