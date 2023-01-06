import { defaultImageProps } from './ImageProps'
import { getWindowHeight } from './optimized-inner-height'
import { getWindowWidth } from './optimized-inner-width'

export default function checkVisibility(
  element: Element,
  yOffset: number = defaultImageProps.yOffset,
  xOffset: number | 'any' = defaultImageProps.xOffset,
): boolean {
  const position = element.getBoundingClientRect()

  const yIsNear =
    position.y - yOffset <= getWindowHeight() && position.y + yOffset + position.height > 0
  const xIsNear =
    xOffset === 'any' ||
    (position.x - xOffset <= getWindowWidth() && position.x + xOffset + position.width > 0)
  const isNotDisabled = !(
    position.height === 0 &&
    position.width === 0 &&
    position.x === 0 &&
    position.y === 0
  )

  return yIsNear && xIsNear && isNotDisabled
}
