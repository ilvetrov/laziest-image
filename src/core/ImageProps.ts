import setDefaultProps from './setDefaultProps'
import { WithRequired } from './WithRequired'

export interface ImageProps {
  src: string
  srcSet?: string
  sizes?: string
  width?: number | string
  height?: number | string
  /**
   * @default 'auto'
   */
  load?: boolean | 'auto'
  /**
   * @default true
   */
  withBrowserLazyLoading?: boolean
  /**
   * Ignored if withBrowserLazyLoading is true.
   * @default 800
   */
  yOffset?: number
  /**
   * Ignored if withBrowserLazyLoading is true.
   * @default 400
   */
  xOffset?: number | 'any'
  doNotCreateBlank?: boolean
  onLoad?(src: string): void
  onFirstLoad?(src: string): void
  onSrcSetChange?(src: string): void
  watchForVirtualImage?: boolean
}

export type ImagePropsDefaultProps = {
  load: 'auto'
  yOffset: 800
  xOffset: 400
  withBrowserLazyLoading: true
}

export type ImagePropsWithDefault<T extends ImageProps> = WithRequired<
  T,
  keyof ImagePropsDefaultProps
>

export const defaultImageProps: ImagePropsDefaultProps = {
  load: 'auto',
  yOffset: 800,
  xOffset: 400,
  withBrowserLazyLoading: true,
} as const

export function setDefaultImageProps<T extends ImageProps>(props: T): ImagePropsWithDefault<T> {
  return setDefaultProps(props, defaultImageProps)
}
