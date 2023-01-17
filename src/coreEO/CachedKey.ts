import cached from './cached'

export interface ICachedKey<T> {
  get(key: any, getter: () => T): T
}

export class CachedKey<T> implements ICachedKey<T> {
  private readonly store: () => Map<any, T> = cached(() => new Map())

  get(key: any, getter: () => T): T {
    if (!this.store().has(key)) {
      this.store().set(key, getter())
    }

    return this.store().get(key) as T
  }
}
