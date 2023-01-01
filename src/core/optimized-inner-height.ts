import { newOptimizedGetterAndEvent } from './optimized-getter'

const { eventName, getter } = newOptimizedGetterAndEvent({
  initial: () => window.innerHeight,
  checker: (oldValue, newValue) => oldValue !== newValue,
  element: () => window,
  originalEventName: 'resize',
  newEventName: 'resize-height',
})

export const resizeHeightEventName = eventName
export const getWindowHeight = getter
