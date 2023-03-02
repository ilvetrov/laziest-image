export interface LazyImageProps {
  src: string
  srcSet?: string
  sizes?: string
  width?: number | string
  height?: number | string
  afterPageLoad?: boolean
  withoutBlank?: boolean
  onLoad?(src: string): void
  onFirstLoad?(src: string): void
  onSrcChange?(src: string): void
  customLoading?: boolean
  /**
   * Only for Custom Loading.
   * @default "150%"
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
