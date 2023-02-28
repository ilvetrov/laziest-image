type Length<T extends any[]> = T extends { length: infer L } ? L : never

type TupleFrom<L extends number, T extends any[] = []> = T extends { length: L }
  ? T
  : TupleFrom<L, [...T, any]>

type Add<A extends number, B extends number> = Length<[...TupleFrom<A>, ...TupleFrom<B>]>

type ComponentType<T extends string> = T

type ComponentId<
  Types extends ReadonlyArray<ReadonlyArray<string>>,
  CurrentGroup extends number = 0,
> = `${ComponentType<
  Types[CurrentGroup][number]
  // @ts-expect-error
>}${Types[Add<CurrentGroup, 1>] extends ReadonlyArray<string>
  ? // @ts-expect-error
    `_${ComponentId<Types, Add<CurrentGroup, 1>>}`
  : ''}`

type TestComponentId = ComponentId<[['Lazy', 'Defer'], ['Component', 'Hook'], ['AfterPageLoad', 'Once']]>

function componentsNames<Types extends ReadonlyArray<ReadonlyArray<string>>>(
  types: Types,
): { [Key in ComponentId<Types>]: Key } {
  return new Proxy({}, {
    get(_target, property) {
      return property
    },
  }) as { [Key in ComponentId<Types>]: Key }
}

const testComponentNames = componentsNames([
  ['Lazy', 'Defer'],
  ['Component', 'Hook'],
  ['AfterPageLoad', 'Once'],
] as const)
