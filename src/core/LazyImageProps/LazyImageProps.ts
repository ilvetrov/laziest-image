export interface LazyImageProps {
  src: string
  srcSet?: string
  sizes?: string
  width?: number | string
  height?: number | string
  afterPageLoad?: boolean
  customLoading?: boolean
  yOffset?: string
  xOffset?: string
  withoutBlank?: boolean
  withoutWatchingSrcChange?: boolean
  onLoad?(src: string): void
  onFirstLoad?(src: string): void
  onSrcChange?(src: string): void
}
