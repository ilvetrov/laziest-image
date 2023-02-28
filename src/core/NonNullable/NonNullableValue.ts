export function NonNullableValue<T>(value: T | undefined | null): T {
  if (value === undefined || value === null) {
    throw new Error(`value is ${value}`)
  }

  return value
}
