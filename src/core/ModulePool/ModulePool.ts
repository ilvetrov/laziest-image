import { mapObject } from '../mapObject'
import { Optional, IOptional } from './Optional'

type BaseEnvironment = Record<string | number | symbol, any>
type OptionalDecorators<
  Decorators extends Record<string | number | symbol, (...args: any) => any>,
> = {
  [Key in keyof Decorators]: IOptional<Decorators[Key]>
}

export interface IModulePool<
  Environment extends BaseEnvironment,
  Decorators extends Record<string | number | symbol, (...args: any) => any>,
> {
  fill: <Output>(
    pool: (environment: Environment, decorator: OptionalDecorators<Decorators>) => Output,
  ) => Output
}

export function ModulePool<
  Environment extends BaseEnvironment,
  Decorators extends Record<string | number | symbol, (...args: any) => any>,
>(environment: Environment, decorators: Decorators): IModulePool<Environment, Decorators> {
  const optionalDecorators = mapObject(decorators, (decorator) => Optional(decorator))

  return {
    fill(pool) {
      return pool(environment, optionalDecorators)
    },
  }
}
