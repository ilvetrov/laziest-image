import { IConfig } from '../Config/Config'
import { LazyImageProps } from '../LazyImageProps/LazyImageProps'

export type ILazyImageConfig = IConfig<LazyImageProps>

export function LazyImageConfig(content: LazyImageProps): ILazyImageConfig {
  return {
    content: () => content,
  }
}
