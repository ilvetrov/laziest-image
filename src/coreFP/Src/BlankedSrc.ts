import { ISrc } from './Src'

export function BlankedSrc(origin: ISrc): ISrc {
  return {
    src: origin.loaded ? origin.src : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
    srcSet: origin.loaded ? origin.srcSet : '',
    sizes: origin.loaded ? origin.sizes : '',
    loaded: origin.loaded,
  }
}
