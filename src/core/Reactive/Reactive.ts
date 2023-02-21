export type Unsubscribe = () => void

export interface IReactive<T> {
  current(): T
  onChange(callback: (value: T) => void): Unsubscribe
}

export function Reactive<T>({ current, onChange }: IReactive<T>): IReactive<T> {
  return {
    current,
    onChange,
  }
}
