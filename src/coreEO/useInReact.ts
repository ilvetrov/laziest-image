import { DependencyList, useEffect, useMemo, useRef, useState } from 'react'
import { Destroyers } from './Destroyers'
import useForceRender from './useForceRender'

export default function useInReact<T>(props: {
  callback: (
    render: (newValue: T) => void,
    onChangeDeps: (destroyer: () => void) => void,
    onUnmount: (destroyer: () => void) => void,
  ) => T
  serverCallback?: () => T
  deps: DependencyList
}): T {
  const [valueAfterRender, setValueAfterRender] = useState<T>()
  const destroyersOnChangeDeps = useMemo(() => new Destroyers(), [])
  const valueDependsOnDom = useRef(false)
  const destroyersOnUnmount = useMemo(() => new Destroyers(), [])

  const [renderOnNewDom, currentDomMark] = useForceRender()
  const unmounted = useRef(false)

  const initValue = useMemo(() => {
    destroyersOnChangeDeps.destroyAll()

    valueDependsOnDom.current = false

    if (typeof window === 'undefined' && props.serverCallback) {
      return props.serverCallback()
    }

    const value = props.callback(
      (newValue) => {
        if (typeof window !== 'undefined') {
          setValueAfterRender(newValue)
        }
      },
      (destroyer) => destroyersOnChangeDeps.add(destroyer),
      (destroyer) => {
        valueDependsOnDom.current = true
        destroyersOnUnmount.add(destroyer)
      },
    )

    return value
  }, [...props.deps, currentDomMark])

  useEffect(() => {
    if (unmounted.current === true) {
      if (valueDependsOnDom.current) {
        renderOnNewDom()
        setValueAfterRender(undefined)
      }
    }

    unmounted.current = false

    return () => {
      unmounted.current = true
      destroyersOnUnmount.destroyAll()

      if (valueDependsOnDom.current) {
        destroyersOnChangeDeps.destroyAll()
      }
    }
  }, [])

  return valueAfterRender ?? initValue
}
