import { Memory, ReactiveMemory } from '../Memory/Memory'
import { IReactive } from './Reactive'

export interface IControlledReactive<T> extends IReactive<T> {
  changeValue(value: T): void
  unsubscribeAll(): void
  clear(): void
}

export function ControlledReactive<T>(initValue: T): IControlledReactive<T> {
  const memory = ReactiveMemory(Memory(initValue))

  return {
    current: () => memory.read(),
    onChange: (callback) => memory.onUpdate(callback),
    changeValue: (value) => memory.write(value),
    unsubscribeAll: () => memory.unsubscribeAll(),
    clear: memory.reset,
  }
}
