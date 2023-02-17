import { ReactNode, useCallback, useState } from 'react'

export default function Controlled({
  children,
  defaultShow = true,
  id,
}: {
  children: (appendText: (text: string) => void) => ReactNode
  defaultShow?: boolean
  id: string
}) {
  const [dataText, setDataText] = useState('')

  const appendText = useCallback((text: string) =>
    setDataText((oldText) => `${oldText ? `${oldText} - ` : ''}${text}`), [])

  return (
    <div data-text={dataText}>
      {children(appendText)}
    </div>
  )
}
