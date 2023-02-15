export interface ISrc {
  src: string
  srcSet: string
  sizes: string
  loaded: boolean
}

export function Src(src: string, srcSet: string, sizes: string, loaded: boolean): ISrc {
  return {
    src,
    srcSet,
    sizes,
    loaded,
  }
}
