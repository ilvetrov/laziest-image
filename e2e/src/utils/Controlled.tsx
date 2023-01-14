import { ReactNode, useState } from 'react'

export default function Controlled({
  children,
  defaultShow = true,
  id,
}: {
  children: (show: boolean, appendText: (text: string) => void) => ReactNode
  defaultShow?: boolean
  id: string
}) {
  const [show, setShow] = useState(defaultShow)
  const [dataText, setDataText] = useState('')

  const appendText = (text: string) =>
    setDataText((oldText) => `${oldText ? `${oldText} - ` : ''}${text}`)

  return (
    <div data-text={dataText}>
      <div>
        <button
          id={`${id}-button`}
          type="button"
          onClick={() => setShow((lastValue) => !lastValue)}
        >
          Toggle Controlled: {String(show)}
        </button>
      </div>
      {children(show, appendText)}
    </div>
  )
}
