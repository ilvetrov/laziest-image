function isValueFunction<T>(value: T | ((...args: any) => T)): value is (...args: any) => T {
  return typeof value === 'function'
}

export default function valueFromMaybeFunction<T, Args extends any[]>(
  value: T | ((...args: Args) => T),
): (...args: Args) => T {
  if (isValueFunction(value)) {
    return value
  }

  return (() => value) as (...args: Args) => T
}
