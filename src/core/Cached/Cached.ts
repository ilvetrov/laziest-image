type IAnyObject = Record<string | number | symbol, any>

export type ICached<T extends IAnyObject> = T

export function Cached<T extends IAnyObject>(origin: T): ICached<T> {
  const cached = new Map()

  return new Proxy(origin, {
    get(target, key) {
      if (typeof target[key] === 'function') {
        return (...args: unknown[]) => {
          if (!cached.has(key)) {
            cached.set(key, target[key](...args))
          }

          return cached.get(key)
        }
      }

      return target[key]
    },
    set(target, key: keyof T, newValue) {
      target[key] = newValue

      return true
    },
  })
}
