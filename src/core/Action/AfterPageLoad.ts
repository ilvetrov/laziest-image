import { isServer } from '../../components/isServer'
import { OnlyDestroyer } from '../Destroyers/Destroyable'
import { UniqueDestroyable } from '../Destroyers/UniqueDestroyable'
import { Action, IAction, IActionOrigin } from './Action'

export function isPageLoaded() {
  return !isServer && document.readyState === 'complete'
}

export function AfterPageLoad<T extends IActionOrigin>(origin: T): IAction<T> {
  return (...args) => {
    if (isServer) {
      return () => {}
    }

    const action = UniqueDestroyable(OnlyDestroyer(Action(origin)))

    if (isPageLoaded()) {
      return action.run(...args).destroy
    }

    function actionAfterLoad() {
      action.run(...args)
    }

    window.addEventListener('load', actionAfterLoad)

    return () => {
      action.destroy()
      window.removeEventListener('load', actionAfterLoad)
    }
  }
}
