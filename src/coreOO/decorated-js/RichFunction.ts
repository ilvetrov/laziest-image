export type RichFunction<
  Func extends (...args: any) => any,
  Data extends Record<string | number | symbol, unknown>,
> = {
  [Key in keyof Data]: Data[Key]
} & {
  (...args: Parameters<Func>): ReturnType<Func>
}

export function newRichFunction<
  Func extends (...args: any) => any,
  Data extends Record<string | number | symbol, unknown>,
>(func: Func, data: Data = {} as Data): RichFunction<Func, Data> {
  const newFunc = (...args: Parameters<Func>) => func(args)

  Object.keys(data).forEach((key) => {
    newFunc[key] = data[key]
  })

  return newFunc as RichFunction<Func, Data>
}
