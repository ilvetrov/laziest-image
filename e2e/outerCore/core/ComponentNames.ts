type Length<T extends any[]> = T extends { length: infer L } ? L : never

type TupleFrom<L extends number, T extends any[] = []> = T extends { length: L }
  ? T
  : TupleFrom<L, [...T, any]>

type Add<A extends number, B extends number> = Length<[...TupleFrom<A>, ...TupleFrom<B>]>

type ComponentType<T extends string> = T

type ComponentNames<
  Types extends ReadonlyArray<ReadonlyArray<string>>,
  CurrentGroup extends number = 0,
> = Types extends string[][]
  ? string
  : `${ComponentType<
      Types[CurrentGroup][number]
      // @ts-expect-error
    >}${Types[Add<CurrentGroup, 1>] extends ReadonlyArray<string>
      ? // @ts-expect-error
        `_${ComponentNames<Types, Add<CurrentGroup, 1>>}`
      : ''}`

function componentNamesGenerate(
  types: ReadonlyArray<ReadonlyArray<string>>,
  currentGroup = 0,
): Record<string, string> {
  const output: Record<string, string> = {}

  const nextGroup = types[currentGroup + 1]
    ? componentNamesGenerate(types, currentGroup + 1)
    : undefined

  types[currentGroup].forEach((type) => {
    if (nextGroup) {
      const subTypes = nextGroup

      Object.keys(subTypes).forEach((subType) => {
        const complex = `${type}_${subType}`

        output[complex] = complex
      })
    } else {
      output[type] = type
    }
  })

  return output as any
}

export function componentNames<Types extends ReadonlyArray<ReadonlyArray<string>>>(
  types: Types,
) {
  // @ts-expect-error
  return componentNamesGenerate(types) as { [Key in ComponentNames<Types>]: Key }
}
