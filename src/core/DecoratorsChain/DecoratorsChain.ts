export function DecoratorsChain<T>(decorators: ((origin: T) => T)[], origin: T): T {
  return [...decorators].reverse().reduce((lastOrigin, decorator) => decorator(lastOrigin), origin)
}

export function DecoratorsChainOptional<T>(decorators: [(origin: T) => T, any][], origin: T): T {
  return DecoratorsChain(
    decorators.filter((value) => !!value[1]).map((value) => value[0]),
    origin,
  )
}
