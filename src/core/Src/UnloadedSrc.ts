import { ISrc } from './Src'

export function UnloadedSrc(origin: ISrc): ISrc {
  return {
    ...origin,
    loaded: false,
  }
}
