import { IMemory } from './Memory'

export function WeakMemory(): IMemory {
  let content = new WeakMap()

  return {
    read: (key) => content.get(key),

    has: (key) => content.has(key),

    write: (key, value) => content.set(key, value),

    clear: () => (content = new WeakMap()),

    delete: (key) => content.delete(key),
  }
}

export const memory = WeakMemory()
