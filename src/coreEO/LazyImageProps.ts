export interface LazyImageProps {
  src: string
  srcSet?: string
  sizes?: string
  width?: number | string
  height?: number | string
  onLoad?(src: string): void
  onFirstLoad?(src: string): void
  onSrcChange?(src: string): void
  afterPageLoad?: boolean
  customLoading?: CustomLoading
}
export interface CustomLoading {
  element: HTMLElement
  yOffset?: number
  xOffset?: number | 'any'
  withoutBlank?: boolean
  withoutWatchingSrcChange?: boolean
}
