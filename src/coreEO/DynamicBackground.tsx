import React, { DependencyList, MutableRefObject, RefObject, useRef } from 'react'
import { DecoratedToReact } from './decorated-react/DecoratedReact'
import { IDynamicImage, IDynamicImageStatus } from './DynamicImage'
import { useDynamicImage2 } from './useDynamicImage'

export interface DynamicComponentProps {
  dynamicImage: (ref: MutableRefObject<HTMLElement>) => IDynamicImage
  defaultDynamicStatus: IDynamicImageStatus
  deps: DependencyList
}

type OverridedElementProps = {
  style?: Omit<React.CSSProperties, 'backgroundImage' | 'background'>
}

type OnlyElementProps = OverridedElementProps &
  Omit<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    keyof OverridedElementProps
  >

export type DynamicBackgroundElementProps<UserProps> = UserProps &
  Omit<OnlyElementProps, keyof UserProps>

function isRefWithValue<T>(ref: RefObject<T> | MutableRefObject<T>): ref is MutableRefObject<T> {
  return Boolean(ref.current)
}

export default function DynamicBackground({
  dynamicImage,
  deps,
  elementProps,
}: DynamicComponentProps & {
  elementProps: OnlyElementProps
}) {
  const ref = useRef<HTMLDivElement>(null)
  const imageStatus = useDynamicImage2(() => {
    return new DecoratedToReact((lifetime) => {
      lifetime.onEffect(() => {
        if (!isRefWithValue(ref)) {
          throw new Error('ref is null')
        }

        const image = dynamicImage(ref)

        image.status().subscribe((newStatus) => lifetime.render(newStatus))

        image.load()

        lifetime.onDestroy(() => image.destroy())
      })

      return {
        readySrc: '',
        loaded: false,
      }
    })
  }, deps)

  return (
    <div
      {...elementProps}
      style={{
        ...elementProps.style,
        backgroundImage: imageStatus.loaded ? `url(${imageStatus.readySrc})` : undefined,
      }}
      ref={ref}
    ></div>
  )
}
