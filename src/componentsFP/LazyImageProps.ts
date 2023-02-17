export interface LazyImageProps {
  src: string
  srcSet?: string
  sizes?: string
  width?: number | string
  height?: number | string
  afterPageLoad?: boolean
  customLoading?: CustomLoading
  onLoad?(src: string): void
  onFirstLoad?(src: string): void
  onSrcChange?(src: string): void
}

export interface CustomLoading {
  yOffset?: string
  xOffset?: string
  withoutBlank?: boolean
  withoutWatchingSrcChange?: boolean
}
