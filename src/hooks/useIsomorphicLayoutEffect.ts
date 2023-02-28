import { useEffect, useLayoutEffect } from 'react'
import { isServer } from '../components/isServer'

const useIsomorphicLayoutEffect = isServer ? useEffect : useLayoutEffect

export default useIsomorphicLayoutEffect
