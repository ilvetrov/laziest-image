type IAnyObject = Record<string | number | symbol, any>

export function omitObject<T extends IAnyObject, Keys extends ReadonlyArray<keyof T>>(
  input: T,
  keys: Keys,
): Omit<T, Keys[number]> {
  const output = { ...input }

  keys.forEach((key) => {
    if (output[key] !== undefined) {
      delete output[key]
    }
  })

  return output
}
