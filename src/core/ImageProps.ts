export interface ImageProps {
  src: string
  srcSet?: string
  sizes?: string
  width?: number | string
  height?: number | string
  /**
   * `undefined` — auto loading.
   * `true` — load immediately.
   * `false` — image will never load.
   */
  load?: boolean
  onLoad?(src: string): void
  onFirstLoad?(src: string): void
  onSrcChange?(src: string): void
  afterPageLoad?: boolean
  customLoading?: CustomLoading
}

export const imagePropsKeys: (keyof ImageProps)[] = [
  'src',
  'srcSet',
  'sizes',
  'width',
  'height',
  'load',
  'onLoad',
  'onFirstLoad',
  'onSrcChange',
  'afterPageLoad',
  'customLoading',
]

export interface CustomLoading {
  /**
   * @default 800
   */
  yOffset?: number
  /**
   * @default 400
   */
  xOffset?: number | 'any'
  withoutBlank?: boolean
  withoutWatchingSrcChange?: boolean
}

export interface ImageStatus {
  readySrc: string
  loaded: boolean
}

export const defaultImageProps = {
  load: 'auto',
  yOffset: 800,
  xOffset: 400,
} as const

export type ImagePropsDefault = typeof defaultImageProps

/**
 * The function guarantees the constant order of dependencies
 */
export function getImagePropsToUpdateAll(props: ImageProps) {
  return [
    props.src,
    props.srcSet,
    props.sizes,
    props.width,
    props.height,
    props.load,
    props.afterPageLoad,
    props.customLoading?.xOffset,
    props.customLoading?.yOffset,
    props.customLoading?.withoutBlank,
    props.customLoading?.withoutWatchingSrcChange,
  ]
}
