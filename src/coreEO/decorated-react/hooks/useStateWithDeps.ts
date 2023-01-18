import { DependencyList, useCallback, useMemo, useRef, useState } from 'react'
import valueFromMaybeFunction from '../../valueFromMaybeFunction'

interface InnerState<S> {
  value: S
  renderMark: symbol
}

function userStateInInnerState<S>(state: S | (() => S), renderMark: symbol): InnerState<S> {
  return {
    value: valueFromMaybeFunction(state)(),
    renderMark,
  }
}

export default function useStateWithDeps<S>(
  initialState: S | (() => S),
  deps: DependencyList,
): [S, (newState: S) => void] {
  const currentRender = useMemo(() => Symbol('currentRender'), deps)
  const [innerState, setInnerState] = useState<InnerState<S>>(() =>
    userStateInInnerState(initialState, currentRender),
  )

  const newestRender = useRef(currentRender)

  newestRender.current = currentRender

  const setUserState = useCallback((state: S) => {
    setInnerState(userStateInInnerState(state, newestRender.current))
  }, [])

  const stateToReturn =
    innerState.renderMark === currentRender
      ? innerState.value
      : valueFromMaybeFunction(initialState)()

  return [stateToReturn, setUserState]
}
