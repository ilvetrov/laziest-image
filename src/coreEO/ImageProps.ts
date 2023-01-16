export interface ImageProps {
  src: string
  srcSet?: string
  sizes?: string
  width?: number | string
  height?: number | string
  canLoad?: boolean
  afterPageLoad?: boolean
  customLoading?: CustomLoading
  onLoad?(src: string): void
  onFirstLoad?(src: string): void
  onSrcChange?(src: string): void
}

export interface CustomLoading {
  watchElement: HTMLElement
  /**
   * @default 800
   */
  yOffset?: number
  /**
   * @default 400
   */
  xOffset?: number
  withoutBlank?: boolean
  withoutWatchingSrcChange?: boolean
}
