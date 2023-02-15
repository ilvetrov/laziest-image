/** The only mutable object */

import autobind from '../../../coreOO/decorated-js/autobind'

export interface IMemory<T extends Map<any, any> = Map<any, unknown>> {
  read<Key extends keyof T>(key: Key): T[Key]
  write<Key extends keyof T>(key: Key, content: T[Key]): void
  delete<Key extends keyof T>(key: Key): void
  clear(): void
}

@autobind
export class Memory<T extends Map<any, any> = Map<any, unknown>> implements IMemory<T> {
  constructor(private readonly content: T = new Map() as T) {}

  read<Key extends keyof T>(key: Key): T[Key] {
    return this.content.get(key)
  }

  write<Key extends keyof T>(key: Key, content: T[Key]): void {
    this.content.set(key, content)
  }

  delete<Key extends keyof T>(key: Key): void {
    this.content.delete(key)
  }

  clear(): void {
    this.content.clear()
  }
}
