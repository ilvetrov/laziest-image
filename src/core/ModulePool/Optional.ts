export type IOptional<D extends (...args: any) => any> = <
  UseDecorator extends boolean | undefined = undefined,
>(
  origin: Parameters<D>[0],
  /**
   * @default true
   */
  useDecorator?: UseDecorator,
  ...args: OmitFirstArg<Parameters<D>>
) => UseDecorator extends true | undefined ? ReturnType<D> : Parameters<D>[0]

/* eslint-disable max-classes-per-file */
export function Optional<D extends (...args: any) => any>(Func: D): IOptional<D> {
  return (origin, useDecorator, ...args) => {
    if (useDecorator || useDecorator === undefined) {
      return Func(origin, ...args)
    }

    return origin
  }
}

export type IOptionalInterface<
  Interface,
  D extends (origin: Interface, ...args: any) => Interface,
> = (
  origin: Interface,
  /**
   * @default true
   */
  useDecorator?: boolean,
  ...args: OmitFirstArg<Parameters<D>>
) => Interface

export function OptionalInterface<Interface>() {
  return <D extends (origin: Interface, ...args: any) => any>(Func: D) =>
    (
      origin: Interface,
      /**
       * @default true
       */
      useDecorator = true,
      ...args: OmitFirstArg<Parameters<D>>
    ): Interface =>
      Optional(Func)(origin, useDecorator, ...args)
}

type OmitFirstArg<T extends unknown[]> = T extends [any, ...infer U] ? U : never
