let lastId = 0

export default function uniqueId(): number {
  lastId += 1

  return lastId
}
