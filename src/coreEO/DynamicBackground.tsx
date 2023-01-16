import React, { DependencyList, MutableRefObject, RefObject, useRef } from 'react'
import { IDynamicImage, IDynamicImageStatus } from './DynamicImage'
import useDynamicImage from './useDynamicImage'

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
  defaultDynamicStatus,
  deps,
  elementProps,
}: DynamicComponentProps & {
  elementProps: OnlyElementProps
}) {
  const ref = useRef<HTMLDivElement>(null)
  const imageStatus = useDynamicImage(
    () => {
      if (!isRefWithValue(ref)) {
        throw new Error('ref is null')
      }

      return dynamicImage(ref)
    },
    defaultDynamicStatus,
    deps,
  )

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
