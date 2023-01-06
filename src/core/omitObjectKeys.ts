export default function omitObjectKeys<T extends object, Key extends keyof T, Keys extends Key[]>(
  object: T,
  keys: Keys,
): Omit<T, Keys[number]> {
  const newObject = { ...object }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if (newObject[key] !== undefined) {
      delete newObject[key]
    }
  }

  return newObject
}
