import { IConfig, IConfigSample } from './Config'
import { omitObject } from './omitObject'

export function OmitedConfig<T extends IConfigSample, Keys extends ReadonlyArray<keyof T>>(
  origin: IConfig<T>,
  keys: Keys,
): IConfig<Omit<T, Keys[number]>> {
  return {
    content() {
      return omitObject(origin.content(), keys)
    },
  }
}
