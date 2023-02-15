import PureHandlers from 'pure-handlers'
import { isServer } from '../core/isServer'

export function isPageLoaded() {
  return !isServer && document.readyState === 'complete'
}

export function afterPageLoad(): {
  promise: Promise<void>
  destroy: () => void
} {
  const pureHandlers = new PureHandlers()

  const promise = new Promise<void>((resolve) => {
    if (isServer) {
      throw new Error("Don't run on the server")
    }

    if (isPageLoaded()) {
      resolve()
    } else {
      pureHandlers.addEventListener(window, 'load', () => resolve())
    }
  })

  return {
    promise,
    destroy() {
      pureHandlers.destroy()
    },
  }
}
