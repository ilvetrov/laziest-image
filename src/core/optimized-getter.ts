import { isServer } from './isServer'

export type Destroyer = () => void

export function newOptimizedGetter<T>(
  getter: () => T,
  updater: (update: (value: T) => void) => Destroyer,
): [() => T, Destroyer] {
  if (isServer) {
    return [
      () => {
        throw new Error('Do not run on the server')
      },
      () => {},
    ]
  }

  let value = getter()

  const destroyer = updater((newValue) => (value = newValue))

  return [() => value, destroyer]
}

export function newOptimizedGetterAndEvent<
  T,
  ElementT extends Element,
  NewEventName extends string,
>(props: {
  initial: () => T
  getter?: (event: Event) => T
  checker?: (oldValue: T, newValue: T, event: Event) => boolean
  element: ElementT | (() => ElementT)
  originalEventName: keyof HTMLElementEventMap
  newEventName: NewEventName
}): { eventName: NewEventName; getter: () => T; destroyer: () => void }

export function newOptimizedGetterAndEvent<
  T,
  ElementT extends Window,
  NewEventName extends string,
>(props: {
  initial: () => T
  getter?: (event: Event) => T
  checker?: (oldValue: T, newValue: T, event: Event) => boolean
  element: ElementT | (() => ElementT)
  originalEventName: keyof WindowEventMap
  newEventName: NewEventName
}): { eventName: NewEventName; getter: () => T; destroyer: () => void }

export function newOptimizedGetterAndEvent<
  T,
  ElementT extends Element | Window,
  NewEventName extends string,
>({
  checker = () => true,
  initial,
  getter = initial,
  element,
  newEventName,
  originalEventName,
}: {
  initial: () => T
  getter?: (event: Event) => T
  checker?: (oldValue: T, newValue: T, event: Event) => boolean
  element: ElementT | (() => ElementT)
  originalEventName: keyof HTMLElementEventMap | keyof WindowEventMap
  newEventName: NewEventName
}): { eventName: NewEventName; getter: () => T; destroyer: () => void } {
  if (isServer) {
    return {
      getter: () => {
        throw new Error('Do not run on the server')
      },
      destroyer: () => {},
      eventName: newEventName,
    }
  }

  let value = initial()

  const newEvent = new CustomEvent(newEventName)

  const handler = (event: Event) => {
    const newValue = getter(event)

    if (checker(value, newValue, event)) {
      value = newValue

      if (typeof element === 'function') {
        element().dispatchEvent(newEvent)
      } else {
        element.dispatchEvent(newEvent)
      }
    }
  }

  if (typeof element === 'function') {
    element().addEventListener(originalEventName, handler)
  } else {
    element.addEventListener(originalEventName, handler)
  }

  const destroyer = () => {
    if (typeof element === 'function') {
      element().removeEventListener(originalEventName, handler)
    } else {
      element.removeEventListener(originalEventName, handler)
    }
  }

  return { getter: () => value, eventName: newEventName, destroyer }
}
