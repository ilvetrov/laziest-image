export default function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
) {
  let timeoutID: NodeJS.Timeout | undefined

  const debounced = (...args: Args) => {
    clearTimeout(timeoutID)
    timeoutID = setTimeout(() => fn(...args), delay)
  }

  return debounced
}
