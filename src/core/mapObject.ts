export function mapObject<Origin extends Record<any, any>, Output>(
  origin: Origin,
  callbackOnEach: (element: Origin[keyof Origin]) => Output,
): {
  [Key in keyof Origin]: Output
} {
  const mapped = {}

  Object.keys(origin).forEach((key) => {
    mapped[key] = callbackOnEach(origin[key])
  })

  return mapped as any
}
