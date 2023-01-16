export default function cached<T>(value: () => T): () => T {
  let cachedValue: T | undefined

  return () => {
    if (!cachedValue) {
      cachedValue = value()
    }

    return cachedValue
  }
}
