import { OptionalCallback } from '../Optional/OptionalCallback'

type Cancel = () => void

export type IActionOrigin = (...args: any) => Cancel | void
export type IAction<T extends IActionOrigin> = (...args: Parameters<T>) => Cancel

export function Action<T extends IActionOrigin>(action: T): IAction<T> {
  return (...args) => OptionalCallback(action(...args))
}
