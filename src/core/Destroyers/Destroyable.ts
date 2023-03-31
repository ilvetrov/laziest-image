export type IDestroyer = () => void

export type IDestroyableOrigin = (...args: any) => { result?: any; destroy?: IDestroyer }

export interface IDestroyable<T extends IDestroyableOrigin> {
  run(...args: Parameters<T>): {
    result: unknown extends ReturnType<T>['result'] ? void : ReturnType<T>['result']
    destroy: IDestroyer
  }
  destroy(): void
}

export function Destroyable<T extends IDestroyableOrigin>(origin: T): IDestroyable<T> {
  const destroyers: IDestroyer[] = []

  return {
    run(...args) {
      const { destroy, result } = origin(...args)

      let destroyerInList: () => void

      if (destroy) {
        const index = destroyers.push(destroy) - 1

        destroyerInList = () => {
          destroy()
          destroyers.splice(index, 1)
        }
      } else {
        destroyerInList = () => {}
      }

      return {
        result,
        destroy: destroyerInList,
      }
    },
    destroy() {
      destroyers.forEach((destroyer) => destroyer())
      destroyers.length = 0
    },
  }
}

export function OnlyDestroyer<T extends (...args: any) => IDestroyer>(
  origin: T,
): (...args: Parameters<T>) => { result: void; destroy: IDestroyer } {
  return (...args) => ({
    result: undefined,
    destroy: origin(...args),
  })
}
