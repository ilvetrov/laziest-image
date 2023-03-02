export type IConfigSample = Record<string | number | symbol, any>

export interface IConfig<T extends IConfigSample> {
  content(): T
}

export function Config<T extends IConfigSample>(content: T): IConfig<T> {
  return {
    content: () => content,
  }
}
