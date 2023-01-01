export default function setDefaultProps<T extends object, DefaultKey extends keyof T>(
  origin: T,
  defaultValues: {
    [Prop in DefaultKey]-?: NonNullable<T[Prop]>
  },
): Omit<T, DefaultKey> & {
  [Prop in DefaultKey]-?: NonNullable<T[Prop]>
} {
  const newProps = { ...origin }

  Object.keys(defaultValues).forEach((key) => {
    if (newProps[key] === undefined || newProps[key] === null) {
      newProps[key] = defaultValues[key]
    }
  })

  return newProps as Omit<T, DefaultKey> & {
    [Prop in DefaultKey]-?: NonNullable<T[Prop]>
  }
}
