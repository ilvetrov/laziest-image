export function defaultProps<T extends Record<string | number | symbol, any>>(
  origin: T,
  defaultValues: Partial<T>,
): T {
  const output = { ...origin }

  Object.keys(defaultValues).forEach((defaultKey: keyof T) => {
    if (output[defaultKey] === undefined || output[defaultKey] === null) {
      ;(output as any)[defaultKey] = defaultValues[defaultKey]
    }
  })

  return output
}
