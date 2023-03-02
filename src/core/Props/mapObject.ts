type IAnyObject = Record<string | number | symbol, any>

export function mapObject<T extends IAnyObject, Callback extends (value: T[keyof T]) => unknown>(
  input: T,
  callback: Callback,
): {
  [Key in keyof T]: ReturnType<Callback>
} {
  const output: IAnyObject = { ...input }

  Object.keys(output).forEach((key: keyof T) => {
    output[key] = callback(output[key])
  })

  return output as {
    [Key in keyof T]: ReturnType<Callback>
  }
}
