/* eslint-disable @typescript-eslint/no-shadow */
import { If } from '../../If'
import { IOneMemory } from '../../Memory/OneMemory'
import { ModulePool } from '../../ModulePool/ModulePool'
import { BlankedLazyImage } from '../BlankedLazyImage'
import { LazyImage } from '../LazyImage'
import { LazyImageAfterPageLoad } from '../LazyImageAfterPageLoad'
import { LazyImageEvents } from '../LazyImageEvents'
import { LazyImageInVisibleArea } from '../LazyImageInVisibleArea'
import { LazyImageVirtual } from '../LazyImageVirtual'
import { LazyImageWithUpdateOnlyIfVisible } from '../LazyImageWithUpdateOnlyIfVisible'
import { PreloadedLazyImage } from '../PreloadedLazyImage'

const initSrc = { src: '', srcSet: '', sizes: '', loaded: false }

export interface LazyImagePoolEnvironment {
  src: string
  srcSet?: string
  sizes?: string
  width?: number | string
  height?: number | string
  afterPageLoad?: boolean
  customLoading?: CustomLoading
  onLoad?(src: string): void
  onFirstLoad?(src: string): void
  onSrcChange?(src: string): void
  element: () => HTMLElement
  didFirstLoad?: IOneMemory<boolean>
}

export interface CustomLoading {
  yOffset?: string
  xOffset?: string
  withoutBlank?: boolean
  withoutWatchingSrcChange?: boolean
}

export function LazyImagePool(environment: LazyImagePoolEnvironment) {
  return ModulePool(environment, {
    LazyImageEvents,
    LazyImageInVisibleArea,
    BlankedLazyImage,
    LazyImageAfterPageLoad,
    PreloadedLazyImage,
    LazyImageWithUpdateOnlyIfVisible,
    LazyImageVirtual,
    LazyImage,
  }).fill(
    (
      props,
      {
        BlankedLazyImage,
        LazyImage,
        LazyImageAfterPageLoad,
        LazyImageEvents,
        LazyImageInVisibleArea,
        LazyImageVirtual,
        LazyImageWithUpdateOnlyIfVisible,
        PreloadedLazyImage,
      },
    ) => {
      const needEmptyInit = Boolean(props.afterPageLoad || props.customLoading)

      const finalSrc = {
        src: props.src,
        srcSet: props.srcSet ?? '',
        sizes: props.sizes ?? '',
        loaded: true,
      }

      return LazyImageEvents(
        LazyImageInVisibleArea(
          BlankedLazyImage(
            LazyImageAfterPageLoad(
              PreloadedLazyImage(
                LazyImageWithUpdateOnlyIfVisible(
                  If(
                    LazyImageVirtual,
                    LazyImage,
                    props.customLoading && !props.customLoading?.withoutWatchingSrcChange,
                  )(finalSrc, true, needEmptyInit ? initSrc : finalSrc),
                  props.customLoading && !props.customLoading?.withoutWatchingSrcChange,
                  props.element,
                  props.customLoading?.yOffset,
                  props.customLoading?.xOffset,
                ),
                props.customLoading?.withoutWatchingSrcChange,
              ),
              props.afterPageLoad,
            ),
            !props.customLoading?.withoutBlank && needEmptyInit,
          ),
          props.customLoading !== undefined,
          props.element,
          props.customLoading?.yOffset,
          props.customLoading?.xOffset,
        ),
        Boolean(props.onLoad || props.onFirstLoad || props.onSrcChange),
        props.onLoad,
        props.onFirstLoad,
        props.onSrcChange,
        props.didFirstLoad,
      )
    },
  )
}
