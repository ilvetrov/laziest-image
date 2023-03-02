import { IConfig, IConfigSample } from './Config'

export function ExtendedConfig<T extends IConfigSample, ConfigExtenstion extends IConfigSample>(
  origin: IConfig<T>,
  configExtenstion: ConfigExtenstion,
): IConfig<T & ConfigExtenstion> {
  return {
    content() {
      return {
        ...origin.content(),
        ...configExtenstion,
      }
    },
  }
}
