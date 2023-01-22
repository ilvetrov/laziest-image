export default function neverPromise<T>(): Promise<T> {
  return new Promise(() => {})
}
