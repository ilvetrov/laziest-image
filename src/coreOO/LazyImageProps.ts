import { MutableRefObject } from 'react'

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
  element?: MutableRefObject<HTMLElement | null>
  yOffset?: string
  xOffset?: string | 'any'
  withoutBlank?: boolean
  withoutWatchingSrcChange?: boolean
}
