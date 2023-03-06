import { OnlyThatProps } from '../Props/OnlyThatProps'

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
   * Only for Custom Loading.
   * @default "200%"
   */
  yOffset?: string
  /**
   * Only for Custom Loading.
   * @default "50%"
   */
  xOffset?: string
  /**
   * Only for Custom Loading.
   */
  withoutWatchingSrcChange?: boolean
  /**
   * Only for Custom Loading.
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
