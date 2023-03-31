type RemoveFromHighList = () => void
type Unsubscribe = () => void

export interface IHighList<T> {
  add(value: T): IHighListItem<T>
  size(): number
  remove(item: IHighListItem<T>): void
  clear(): void
}

export interface IHighListItem<T> {
  value: T
  remove: RemoveFromHighList
}

type OnChangeCallback = (size: number) => void

export interface IReactiveHighList<T> extends IHighList<T> {
  onAdd(callback: OnChangeCallback): Unsubscribe
  onRemove(callback: OnChangeCallback): Unsubscribe
  unsubscribeAll(): void
}

export function HighList<T>(): IHighList<T> {
  const store = new Set<IHighListItem<T>>()

  const highList: IHighList<T> = {
    add(value) {
      const item = HighListItem(value, highList)

      store.add(item)

      return item
    },
    size() {
      return store.size
    },
    remove(item) {
      store.delete(item)
    },
    clear() {
      store.clear()
    },
  }

  return highList
}

function HighListItem<T>(value: T, highList: IHighList<T>): IHighListItem<T> {
  const item: IHighListItem<T> = {
    value,
    remove() {
      highList.remove(item)
    },
  }

  return item
}

function ReactiveHighListItem<T>(origin: IHighListItem<T>, onRemove: () => void): IHighListItem<T> {
  return {
    value: origin.value,
    remove() {
      origin.remove()
      onRemove()
    },
  }
}

export function ReactiveHighList<T>(origin: IHighList<T>): IReactiveHighList<T> {
  const addCallbacks = new Set<OnChangeCallback>()
  const removeCallbacks = new Set<OnChangeCallback>()

  function onAdd() {
    const size = origin.size()

    addCallbacks.forEach((callback) => callback(size))
  }

  function onRemove() {
    const size = origin.size()

    removeCallbacks.forEach((callback) => callback(size))
  }

  return {
    add(value) {
      const item = ReactiveHighListItem(origin.add(value), onRemove)

      onAdd()

      return item
    },
    remove(item) {
      origin.remove(item)

      onRemove()
    },
    onAdd(callback) {
      addCallbacks.add(callback)

      return () => addCallbacks.delete(callback)
    },
    onRemove(callback) {
      removeCallbacks.add(callback)

      return () => removeCallbacks.delete(callback)
    },
    unsubscribeAll() {
      addCallbacks.clear()
      removeCallbacks.clear()
    },
    clear() {
      origin.clear()

      onRemove()
    },
    size: origin.size,
  }
}
