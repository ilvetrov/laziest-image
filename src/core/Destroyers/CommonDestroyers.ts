import { IDestroyers } from './Destroyers'

export function CommonDestroyers(...origins: IDestroyers[]): IDestroyers {
  return {
    add: (destroyer) => origins.forEach((origin) => origin.add(destroyer)),
    destroyAll() {
      origins.forEach((origin) => origin.destroyAll())
    },
  }
}

export function OnCommonDestroy(
  ...methodsToAdd: ((callback: () => void) => void)[]
): (callback: () => void) => void {
  return (destroyer) => methodsToAdd.forEach((methodToAdd) => methodToAdd(destroyer))
}
