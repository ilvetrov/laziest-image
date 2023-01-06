import createCache from './cache'

const cache = createCache<string>()

export function createBlank(width: number | string, height: number | string): string {
  return cache(
    `${width}-${height}`,
    () =>
      `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="rgba(0, 0, 0, 0)" /></svg>`,
      )}`,
  )
}
