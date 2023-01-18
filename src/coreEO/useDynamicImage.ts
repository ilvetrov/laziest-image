import { DependencyList, useEffect, useState } from 'react'
import { DecoratedToReact } from './decorated-react/DecoratedReact'
import useDecoratedToReact from './decorated-react/useDecoratedToReact'
import { IDynamicImage, IDynamicImageStatus } from './DynamicImage'
import useInReact from './useInReact'

export function useDynamicImage2(
  getDynamicImage: () => DecoratedToReact<IDynamicImageStatus>,
  deps: DependencyList,
): IDynamicImageStatus {
  return useDecoratedToReact<IDynamicImageStatus>(() => getDynamicImage(), deps)
}

export function useDynamicImageInEffect(
  getDynamicImage: () => IDynamicImage,
  defaultImageStatus: IDynamicImageStatus,
  deps: DependencyList,
): IDynamicImageStatus {
  const [imageStatus, setImageStatus] = useState<IDynamicImageStatus>(defaultImageStatus)

  useEffect(() => {
    const dynamicImage = getDynamicImage()

    dynamicImage.status().subscribe((newStatus) => setImageStatus(newStatus))

    dynamicImage.load()

    return () => {
      dynamicImage.destroy()
    }
  }, deps)

  return imageStatus
}

export function useDynamicImage(
  getDynamicImage: () => IDynamicImage,
  defaultImageStatus: IDynamicImageStatus,
  deps: DependencyList,
): IDynamicImageStatus {
  const imageStatus = useInReact<IDynamicImageStatus>({
    callback(render, onChangeDeps, onUnmount) {
      const dynamicImage = getDynamicImage()

      dynamicImage.status().subscribe((newStatus) => render(newStatus))

      dynamicImage.load()

      onUnmount(() => dynamicImage.destroy())
      onChangeDeps(() => dynamicImage.destroy())

      return dynamicImage.status().get()
    },
    serverCallback() {
      return defaultImageStatus
    },
    deps,
  })

  return imageStatus
}
