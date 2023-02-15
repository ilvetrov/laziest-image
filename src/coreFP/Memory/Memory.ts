/** The only mutable object */

export interface IMemory {
  read(key: any): unknown
  has(key: any): boolean
  write(key: any, value: any): void
  delete(key: any): void
  clear(): void
}

export function Memory(defaultContent: Record<any, any> = {}): IMemory {
  const content = new Map<any, any>(
    Object.keys(defaultContent).map((key) => [key, defaultContent[key]]),
  )

  return {
    read: (key) => content.get(key),

    has: (key) => content.has(key),

    write: (key, value) => content.set(key, value),

    clear: () => content.clear(),

    delete: (key) => content.delete(key),
  }
}
