import { OneMemory, OnlyNewReactiveOneMemory, ReactiveOneMemory } from '../Memory/OneMemory'
import { IReactive } from './Reactive'

export interface IControlledReactive<T> extends IReactive<T> {
  changeValue(value: T): void
  unsubscribeAll(): void
}

export function ControlledReactive<T>(initValue: T): IControlledReactive<T> {
  const memory = OnlyNewReactiveOneMemory(ReactiveOneMemory(OneMemory(initValue)))

  return {
    current: () => memory.read(),
    onChange: (callback) => memory.onUpdate(callback),
    changeValue: (value) => memory.write(value),
    unsubscribeAll: () => memory.unsubscribeAll(),
  }
}

export function ControlledReactiveFromReactive<T>(origin: IReactive<T>): IControlledReactive<T> {
  const controlled = ControlledReactive(origin.current())

  origin.onChange((value) => controlled.changeValue(value))

  return controlled
}
