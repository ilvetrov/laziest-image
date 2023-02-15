import { ISrc } from './Src'

export function LoadedSrc(origin: ISrc): ISrc {
  return {
    ...origin,
    loaded: true,
  }
}
