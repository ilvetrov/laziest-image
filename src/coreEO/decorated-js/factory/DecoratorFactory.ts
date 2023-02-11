export type DecoratorFactory<T, Data extends Record<string | number | symbol, any>> = {
  result: T
} & {
  [Key in keyof Data]: Data[Key]
}

export function decoratorFactoryToResult<
  T,
  Data extends Record<string | number | symbol, any>,
  Params extends any[],
>(
  decoratorFactoryFunc: (...args: Params) => DecoratorFactory<T, Data>,
): (...args: Parameters<typeof decoratorFactoryFunc>) => T {
  return (...args) => decoratorFactoryFunc(...args).result
}
