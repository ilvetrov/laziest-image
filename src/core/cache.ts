export default function createCache<T>() {
  const cached: Record<string, T> = {}

  return function cache(name: string, value: () => T) {
    if (!cached[name]) {
      cached[name] = value()
    }

    return cached[name]
  }
}
