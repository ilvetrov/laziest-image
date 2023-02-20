import PureHandlers from 'pure-handlers'
import { isServer } from '../componentsFP/isServer'

export function isPageLoaded() {
  return !isServer && document.readyState === 'complete'
}

type DestroyCallback = () => void

export function callAfterPageLoad(callback: () => void): DestroyCallback {
  if (isServer) {
    return () => {}
  }

  const pureHandlers = new PureHandlers()

  if (isPageLoaded()) {
    callback()
  } else {
    pureHandlers.addEventListener(window, 'load', callback)
  }

  return () => {
    pureHandlers.destroy()
  }
}
