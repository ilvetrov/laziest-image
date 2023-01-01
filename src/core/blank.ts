export function createBlank(
  width: number | string,
  height: number | string,
  className?: string,
): string {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="rgba(0, 0, 0, 0)" ${
      className ? `class="${className}"` : ''
    }/></svg>`,
  )}`
}
