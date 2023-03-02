import { Config, IConfig, IConfigSample } from './Config'
import { omitObject } from './omitObject'
import { pickObject } from './pickObject'

export type ISlicedConfig = <T extends IConfigSample, Keys extends ReadonlyArray<keyof T>>(
  origin: IConfig<T>,
  keys: Keys,
) => IConfig<Pick<T, Keys[number]>>

export const SlicedConfig: ISlicedConfig = (origin, keys) => {
  return Config(pickObject(origin.content(), keys))
}

export type ISlicedConfigs = <
  T extends IConfigSample,
  Rules extends ReadonlyArray<ReadonlyArray<keyof T>>,
>(
  origin: IConfig<T>,
  /**
   * Provide rules ` as const` array to get the correct help from the types.
   * Example: `[['prop1', 'prop2']] as const`
   */
  rules: Rules,
) => {
  [Key in keyof Rules]: IConfig<
    Rules extends (keyof T)[][] ? Partial<T> : Pick<T, Rules[Key][number]>
  >
}

export const SlicedConfigs: ISlicedConfigs = (origin, rules) => {
  return rules.map((ruleKeys) => SlicedConfig(origin, ruleKeys)) as any
}

export function RestConfig<Origin extends IConfigSample, Slice extends IConfigSample>(
  origin: IConfig<Origin>,
  slice: IConfig<Slice>,
): IConfig<Omit<Origin, keyof Slice>> {
  return {
    content() {
      return omitObject(origin.content(), Object.keys(slice.content()))
    },
  } as any
}
