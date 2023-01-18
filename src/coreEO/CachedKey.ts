import cached from './cached'

export interface ICachedKey<T, K = any> {
  value(key: K, valueGetter: () => T): T
  forget(key: K): void
  forgetAll(): void
}

export class CachedKey<T, K = any> implements ICachedKey<T> {
  private readonly store: () => Map<any, T> = cached(() => new Map())

  value(key: K, valueGetter: () => T): T {
    if (!this.store().has(key)) {
      this.store().set(key, valueGetter())
    }

    return this.store().get(key) as T
  }

  forget(key: K): void {
    this.store().delete(key)
  }

  forgetAll(): void {
    this.store().clear()
  }
}
