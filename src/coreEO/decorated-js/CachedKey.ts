export interface ICachedKey<Key, T> {
  value(key: Key, valueGetter: () => T): T
  forget(key: Key): void
  forgetAll(): void
}

export class CachedKey<Key, T> implements ICachedKey<Key, T> {
  private readonly store = new Map<any, T>()

  value(key: Key, valueGetter: () => T): T {
    if (!this.store.has(key)) {
      this.store.set(key, valueGetter())
    }

    return this.store.get(key) as T
  }

  forget(key: Key): void {
    this.store.delete(key)
  }

  forgetAll(): void {
    this.store.clear()
  }
}
