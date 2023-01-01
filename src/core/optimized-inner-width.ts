import { newOptimizedGetterAndEvent } from './optimized-getter'

const { eventName, getter } = newOptimizedGetterAndEvent({
  initial: () => window.innerWidth,
  checker: (oldValue, newValue) => oldValue !== newValue,
  element: () => window,
  originalEventName: 'resize',
  newEventName: 'resize-width',
})

export const resizeWidthEventName = eventName
export const getWindowWidth = getter
