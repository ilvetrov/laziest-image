type Required<T extends Record<string | number | symbol, any>> = {
  [Key in keyof T]-?: T[Key]
}

export function OnlyThatProps<T extends Record<string | number | symbol, any>>(
  callback: (origin: Required<T>) => Required<T>,
): <Origin extends T>(origin: Origin) => Omit<T, keyof Origin> & Pick<Origin, keyof T> {
  return callback as any
}
