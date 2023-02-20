import { useEffect, useLayoutEffect } from 'react'
import { isServer } from '../componentsFP/isServer'

const useIsomorphicLayoutEffect = isServer ? useEffect : useLayoutEffect

export default useIsomorphicLayoutEffect
