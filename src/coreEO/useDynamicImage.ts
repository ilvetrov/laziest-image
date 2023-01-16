import { DependencyList, useEffect, useState } from 'react'
import { IDynamicImage, IDynamicImageStatus } from './DynamicImage'

export default function useDynamicImage(
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
