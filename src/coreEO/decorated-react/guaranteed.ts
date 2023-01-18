import cached from '../cached'
import { ExternalPromise } from './ExternalPromise'

export class Guaranteed<T = void> {
  private resolvedValue: T | undefined

  private readonly promise = cached(() => new ExternalPromise<T>())

  public get(callback: (value: T) => void) {
    this.promise().then(() => callback(this.resolvedValue!))
  }

  public set(value: T) {
    this.promise().resolve(value)
    this.resolvedValue = value
  }
}
