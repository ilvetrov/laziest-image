import { Dispatch, ReactNode, SetStateAction, useState } from 'react'

export default function WithState<T>(props: {
  state: T
  children: (state: T, setState: Dispatch<SetStateAction<T>>) => ReactNode
}) {
  const [state, setState] = useState(props.state)

  return <>{props.children(state, setState)}</>
}
