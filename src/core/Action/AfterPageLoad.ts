import { isServer } from '../../components/isServer'
import { UniqueDestroyers } from '../Destroyers/UniqueDestroyers'
import { Action, IAction, ISimpleAction } from './Action'

export function isPageLoaded() {
  return !isServer && document.readyState === 'complete'
}

export function AfterPageLoad(action: ISimpleAction): IAction {
  return () => {
    if (isServer) {
      return () => {}
    }

    if (isPageLoaded()) {
      const cancel = action()

      return () => {
        cancel?.()
      }
    }

    const destroyers = UniqueDestroyers()

    function actionAfterLoad() {
      destroyers.add('actionAfterLoad', Action(action)())
    }

    window.addEventListener('load', actionAfterLoad)
    destroyers.add('load', () => window.removeEventListener('load', actionAfterLoad))

    return () => {
      destroyers.destroyAll()
    }
  }
}
