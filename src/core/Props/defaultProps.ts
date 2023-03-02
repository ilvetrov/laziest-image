export function defaultProps<
  T extends Record<string | number | symbol, any>,
  DefaultValues extends Partial<T>,
>(
  origin: T,
  defaultValues: DefaultValues,
): Omit<T, keyof DefaultValues> & Pick<DefaultValues, keyof T> {
  const output = { ...origin }

  Object.keys(defaultValues).forEach((defaultKey: keyof T) => {
    if (output[defaultKey] === undefined || output[defaultKey] === null) {
      ;(output as any)[defaultKey] = defaultValues[defaultKey]
    }
  })

  return output
}
