/* eslint-disable max-classes-per-file */
function checkOriginExists(index: number, args: unknown[], decoratorName: string) {
  const origin = args[index]

  if (!origin) {
    throw new Error(
      `Index ${index} in arguments of ${decoratorName} has no origin.
      • Info:
      Total number of arguments: ${args.length}.
      Argument #${index} is: ${origin}.
      • Try:
      1) increase or decrease index in the second argument of makeOptional,
      2) check origin, maybe it's undefined,
      3) use another makeOptional function from the lib (e.g., makeOptionalWithCustomOriginPosition).`.replace(
        /  +/g,
        '',
      ),
    )
  }
}

export function makeOptional<D extends new (...args: any) => any>(
  DecoratorConstructor: D,
): new (
  origin: ConstructorParameters<D>[0],
  /**
   * @default true
   */
  useDecorator?: boolean,
  ...args: OmitFirstArg<ConstructorParameters<D>>
) => InstanceType<D> {
  return class OptionalDecorator {
    constructor(
      origin: ConstructorParameters<D>[0],
      /**
       * @default true
       */
      useDecorator = true,
      ...args: OmitFirstArg<ConstructorParameters<D>>
    ) {
      checkOriginExists(0, [origin, args], DecoratorConstructor.name)

      const instance = useDecorator ? new DecoratorConstructor(origin, ...args) : origin

      // eslint-disable-next-line no-constructor-return
      return instance
    }
  } as any
}

export function makeOptionalWithInteface<Interface>() {
  return function <D extends new (origin: Interface, ...args: any) => Interface>(
    DecoratorConstructor: D,
  ): new (
    origin: Interface,
    /**
     * @default true
     */
    useDecorator?: boolean,
    ...args: OmitFirstArg<ConstructorParameters<D>>
  ) => Interface {
    return class OptionalDecorator {
      constructor(
        origin: Interface,
        /**
         * @default true
         */
        useDecorator = true,
        ...args: OmitFirstArg<ConstructorParameters<D>>
      ) {
        checkOriginExists(0, [origin, args], DecoratorConstructor.name)

        const instance = useDecorator ? new DecoratorConstructor(origin, ...args) : origin

        // eslint-disable-next-line no-constructor-return
        return instance as any
      }
    } as any
  }
}

export function makeOptionalWithCustomOriginIndex<D extends new (...args: any) => any>(
  DecoratorConstructor: D,
  argsIndexOfOrigin = 0,
): new (useDecorator: boolean, ...args: ConstructorParameters<D>) => InstanceType<D> {
  return class OptionalDecorator {
    constructor(useDecorator: boolean, ...args: ConstructorParameters<D>) {
      checkOriginExists(argsIndexOfOrigin, args, DecoratorConstructor.name)

      const instance = useDecorator ? new DecoratorConstructor(...args) : args[argsIndexOfOrigin]

      // eslint-disable-next-line no-constructor-return
      return instance
    }
  } as any
}

type OmitFirstArg<T extends unknown[]> = T extends [any, ...infer U] ? U : never
