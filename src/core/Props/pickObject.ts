type IAnyObject = Record<string | number | symbol, any>

export function pickObject<T extends IAnyObject, Keys extends ReadonlyArray<keyof T>>(
  input: T,
  keys: Keys,
): Pick<T, Keys[number]> {
  const output = {} as T

  keys.forEach((key) => {
    output[key] = input[key]
  })

  return output as Pick<T, Keys[number]>
}
