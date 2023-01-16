import { IDynamic } from './Dynamic'

export class NeverDynamic<T> implements IDynamic<T> {
  constructor(private readonly defaultValue: T) {}

  get() {
    return this.defaultValue
  }

  set() {}

  subscribe() {
    return () => {}
  }

  destroy(): void {}
}
