import { ControlledReactiveFromReactive, IControlledReactive } from './ControlledReactive'
import { IReactive } from './Reactive'

export function ControlledReactiveMiddleware<T>(
  origin: IReactive<T>,
  middleware: (value: T) => T,
): IControlledReactive<T> {
  const controlled = ControlledReactiveFromReactive({
    current: () => middleware(origin.current()),
    onChange: (callback) => origin.onChange((value) => callback(middleware(value))),
  })

  return controlled
}
