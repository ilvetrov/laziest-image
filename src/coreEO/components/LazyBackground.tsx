import React from 'react'
import DynamicBackground, { DynamicBackgroundElementProps } from '../DynamicBackground'
import { IDynamicImage } from '../DynamicImage'
import { ImageAfterPageLoad } from '../ImageAfterPageLoad'
import { CustomLoading } from '../ImageProps'
import { ImageWaitInVisibleArea } from '../ImageWaitInVisibleArea'
import { ManualLoadedDynamicImage } from '../ManualLoadedDynamicImage'
import { VirtualWatchingImage } from '../VirtualWatchingImage'

type LazyProps = {
  src: string
  srcSet?: string
  sizes?: string
  afterPageLoad?: boolean
  canLoad?: boolean
  customLoading?: CustomLoading
  onLoad?(src: string): void
  onFirstLoad?(src: string): void
  onSrcChange?(src: string): void
}

export const LazyBackground = LazyBackgroundConstructor()

function LazyBackgroundConstructor(
  userDynamicImage?: (componentImage: IDynamicImage, props: LazyProps) => IDynamicImage,
) {
  return ({
    src,
    srcSet,
    sizes,
    afterPageLoad,
    canLoad,
    customLoading,
    onLoad,
    onFirstLoad,
    onSrcChange,
    ...props
  }: DynamicBackgroundElementProps<LazyProps>) => {
    return (
      <DynamicBackground
        elementProps={props}
        dynamicImage={(ref) => {
          let dynamicImage: IDynamicImage = new ImageWaitInVisibleArea(
            new VirtualWatchingImage(src, srcSet, sizes),
            () => ref.current,
            customLoading?.yOffset,
            customLoading?.xOffset,
          )

          if (afterPageLoad) {
            dynamicImage = new ImageAfterPageLoad(dynamicImage)
          }

          if (canLoad) {
            dynamicImage = new ManualLoadedDynamicImage(dynamicImage, canLoad)
          }

          if (userDynamicImage) {
            dynamicImage = userDynamicImage(dynamicImage, {
              src,
              srcSet,
              sizes,
              afterPageLoad,
              canLoad,
              customLoading,
              onLoad,
              onFirstLoad,
              onSrcChange,
            })
          }

          let didFirstLoad = false

          dynamicImage.status().subscribe((value) => {
            if (onLoad) {
              onLoad(value.readySrc)
            }

            if (!didFirstLoad) {
              if (onFirstLoad) {
                onFirstLoad(value.readySrc)
              }
            } else if (onSrcChange) {
              onSrcChange(value.readySrc)
            }

            didFirstLoad = true
          })

          return dynamicImage
        }}
        defaultDynamicStatus={{
          readySrc: '',
          loaded: false,
        }}
        deps={[src, srcSet, sizes, afterPageLoad, canLoad]}
      ></DynamicBackground>
    )
  }
}
