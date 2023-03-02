import { IConfig, IConfigSample } from './Config'

export function DefaultConfig<T extends IConfigSample>(
  origin: IConfig<T>,
  defaultConfig: Partial<T>,
): IConfig<T> {
  return {
    content() {
      const output = { ...origin.content() }

      Object.keys(defaultConfig).forEach((defaultKey: keyof T) => {
        if (output[defaultKey] === undefined || output[defaultKey] === null) {
          ;(output as any)[defaultKey] = defaultConfig[defaultKey]
        }
      })

      return output
    },
  }
}
