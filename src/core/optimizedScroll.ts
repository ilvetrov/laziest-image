import { isServer } from './isServer'

type Destroyer = () => void

const namePrefix = 'scroll-optimized-'

const optimizedScrollStorageId = Symbol('optimizedScroll')

export function dynamicEventName(
  interval: number,
  element?: Element | Window,
): [string, Destroyer] {
  if (isServer) {
    return ['server', () => {}]
  }

  element ??= window

  const eventName = createName(interval)

  if (!checkElementScrollEvent(eventName, element)) {
    createNewEvent(interval, element)
  }

  // TODO
  return [eventName, () => {}]
}

export const optimizedScrollEventName = dynamicEventName(100)[0]

function createName(interval: number) {
  return namePrefix + String(interval)
}

function checkElementScrollEvent(name: string, element: Element | Window): boolean {
  if (!element[optimizedScrollStorageId]) {
    return false
  }

  return (element[optimizedScrollStorageId] as Set<string>).has(name)
}

function saveScrollEventToEvent(name: string, element: Element | Window) {
  if (!element[optimizedScrollStorageId]) {
    element[optimizedScrollStorageId] = new Set<string>()
  }

  ;(element[optimizedScrollStorageId] as Set<string>).add(name)
}

function createNewEvent(interval: number, element?: Element | Window): Destroyer {
  if (isServer) {
    return () => {}
  }

  element ??= window

  const eventName = createName(interval)
  const event = new CustomEvent(eventName)

  saveScrollEventToEvent(eventName, element)

  let didScroll = false
  element.addEventListener(
    'scroll',
    () => {
      didScroll = true
    },
    {
      passive: true,
    },
  )

  const intervalId = setInterval(() => {
    if (didScroll) {
      didScroll = false

      element?.dispatchEvent(event)
    }
  }, interval)

  return () => clearInterval(intervalId)
}
