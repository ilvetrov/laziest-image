type Cancel = () => void

export type IAction = () => Cancel
export type ISimpleAction = () => Cancel | void

export function Action(action: IAction | ISimpleAction): IAction {
  return () => {
    const cancel = action()

    if (cancel) {
      return cancel
    }

    return voidFunc
  }
}

function voidFunc() {}
