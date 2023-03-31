import { Action, IAction, IActionOrigin } from './Action'

export function ChangeUntilExecuted<T extends IActionOrigin>(
  origin: T,
  decorator: (origin: IAction<T>, value: number) => IAction<T>,
  start = 1,
  step = 1,
  condition: () => boolean = () => true,
  delay = 1000,
  resetAttemptsIf: () => boolean = () => false,
): (...args: Parameters<IAction<T>>) => {
  destroyAction: ReturnType<IAction<T>>
  resetAttempts: () => void
} {
  return (...args) => {
    let attempt = 0

    const interval = setInterval(() => {
      if (resetAttemptsIf()) {
        resetAttempts()
      } else if (condition()) {
        refreshAttempt()
      }
    }, delay)

    const action = () => {
      clearInterval(interval)

      return Action(origin)(...args)
    }

    let currentCancel: (() => void) | undefined

    function refreshAttempt() {
      currentCancel?.()

      currentCancel = decorator(action, start + step * attempt)
      attempt += 1
    }

    refreshAttempt()

    function resetAttempts() {
      attempt = 0
    }

    function destroyAction() {
      clearInterval(interval)
      currentCancel?.()
    }

    return {
      resetAttempts,
      destroyAction,
    }
  }
}
