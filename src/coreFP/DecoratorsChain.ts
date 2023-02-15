export function DecoratorsChain<T>(decorators: ((origin: T) => T)[], origin: T): T {
  return [...decorators].reverse().reduce((lastOrigin, decorator) => decorator(lastOrigin), origin)
}

export function DecoratorsChainOptional<T>(
  decorators: (((origin: T) => T) | undefined | null | boolean | string | number)[],
  origin: T,
): T {
  return DecoratorsChain(
    decorators.filter<(origin: T) => T>(
      (value): value is (origin: T) => T => typeof value === 'function',
    ),
    origin,
  )
}
