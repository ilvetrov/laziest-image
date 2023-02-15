import { useCallback, useState } from 'react'

const newSymbol = () => Symbol('useForceRender')

export default function useForceRender(): [() => void, symbol] {
  const [currentSymbol, setCurrentSymbol] = useState(() => newSymbol())

  const render = useCallback(() => setCurrentSymbol(newSymbol()), [])

  return [render, currentSymbol]
}
