import { OnlyThatProps } from '../Props/OnlyThatProps'

export type Offset = `${number}${'%' | 'px'}`
export const yOffsetDefault: Offset = '200%'
export const xOffsetDefault: Offset = '50%'
export const offsetToNumber = (offset: Offset) =>
  Number(offset.split((offset.match(/[^\d]+$/g) ?? [])[0] ?? 'px').join(''))
export const numberToOffset = (number: number, offset: Offset) =>
  `${number}${(offset.match(/[^\d]+$/g) ?? [])[0] ?? ''}` as Offset

export interface LazyImageProps {
  src: string
  srcSet?: string
  sizes?: string
  width?: number | string
  height?: number | string
  afterPageLoad?: boolean
  withoutBlank?: boolean
  priority?: boolean
  onLoad?(src: string): void
  onFirstLoad?(src: string): void
  onSrcChange?(src: string): void
  customLoading?: boolean
  /**
   * Only for the custom loading.
   * @default "200%"
   */
  yOffset?: Offset
  /**
   * Only for the custom loading.
   * @default "50%"
   */
  xOffset?: Offset
  /**
   * Only for the custom loading.
   */
  withoutWatchingSrcChange?: boolean
  /**
   * Only for the custom loading.
   */
  disabledPreload?: boolean
}

export const lazyImageProps = OnlyThatProps<LazyImageProps>((origin) => ({
  src: origin.src,
  srcSet: origin.srcSet,
  sizes: origin.sizes,
  width: origin.width,
  height: origin.height,
  afterPageLoad: origin.afterPageLoad,
  withoutBlank: origin.withoutBlank,
  priority: origin.priority,
  onLoad: origin.onLoad,
  onSrcChange: origin.onSrcChange,
  onFirstLoad: origin.onFirstLoad,
  customLoading: origin.customLoading,
  yOffset: origin.yOffset,
  xOffset: origin.xOffset,
  withoutWatchingSrcChange: origin.withoutWatchingSrcChange,
  disabledPreload: origin.disabledPreload,
}))
