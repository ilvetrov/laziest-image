export function ensureNotNull<T>(value: T | undefined | null): value is T {
  if (value === undefined || value === null) {
    throw new Error(`value is ${value}`)
  }

  return true
}
