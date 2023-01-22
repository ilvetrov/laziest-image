type ConstructorParametersWithoutFirst<T extends abstract new (...args: any) => any> =
  T extends abstract new (firstArg: any, ...args: infer P) => any ? P : never

/** @deprecated */
export default function optionalDecorator<
  Decorator extends new (
    originInConstructor: InstanceType<Decorator>,
    ...constructorArgs: any
  ) => any,
>(
  DecoratorConstructor: Decorator,
  origin: ConstructorParameters<Decorator>[0],
  accept: boolean,
  ...args: ConstructorParametersWithoutFirst<Decorator>
): InstanceType<Decorator> {
  return accept ? new (DecoratorConstructor as any)(origin, ...args) : origin
}
