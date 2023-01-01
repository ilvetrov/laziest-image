import { isServer } from './isServer'

export const browserSupportsLazyLoading = isServer || 'loading' in HTMLImageElement.prototype
