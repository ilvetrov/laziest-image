import { ReactNode, useCallback, useState } from 'react'

export default function DataText({
  children,
  defaultShow = true,
}: {
  children: (appendText: (text: string) => void) => ReactNode
  defaultShow?: boolean
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
