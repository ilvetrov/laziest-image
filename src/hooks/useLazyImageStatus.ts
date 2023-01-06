import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useEffectWithoutMount } from 'use-effect-without-mount'
import { createBlank } from '../core/blank'
import { browserSupportsLazyLoading } from '../core/browserSupportsLazyLoading'
import { callAfterPageLoad } from '../core/callAfterPageLoad'
import { getImagePropsToUpdateAll, ImageProps, ImageStatus } from '../core/ImageProps'

function canLoadOnMount(props: ImageProps): boolean {
  return (
    props.load || ((props.load ?? true) && !props.customLoading && !props.afterPageLoad) || false
  )
}

function canLoadNowAfterMount(props: ImageProps): boolean {
  return (
    props.load ||
    ((props.load ?? true) &&
      !props.customLoading &&
      browserSupportsLazyLoading &&
      !props.afterPageLoad) ||
    false
  )
}

export default function useLazyImageStatus(props: ImageProps): ImageStatus & {
  setImageStatus: Dispatch<SetStateAction<ImageStatus>>
} {
  const blank =
    (props.customLoading || props.afterPageLoad || props.load !== undefined) &&
    !props.customLoading?.withoutBlank &&
    props.width &&
    props.height
      ? createBlank(props.width, props.height)
      : ''

  const [{ readySrc, loaded }, setImageStatus] = useState<ImageStatus>({
    readySrc: canLoadOnMount(props) ? props.src : '',
    loaded: canLoadOnMount(props),
  })

  useEffect(() => {
    // Re-get to check if the browser does not support native lazy loading.
    // We cannot do this in getReadySrc because if SSR sends
    // a filled src and we then send an empty src, it's a hydratation bug.
    // So we need a new render.
    if (
      canLoadOnMount(props) !==
      canLoadOnMount({
        ...props,
        customLoading: browserSupportsLazyLoading ? props.customLoading : undefined,
      })
    ) {
      setImageStatus(() => ({
        readySrc: '',
        loaded: false,
      }))
    }
  }, [])

  useEffectWithoutMount(() => {
    setImageStatus(() => ({
      readySrc: canLoadNowAfterMount(props) ? props.src : '',
      loaded: canLoadNowAfterMount(props),
    }))
  }, getImagePropsToUpdateAll(props))

  useEffect(() => {
    if (
      (props.load ?? true) &&
      props.afterPageLoad &&
      !props.customLoading &&
      browserSupportsLazyLoading
    ) {
      return callAfterPageLoad(() => {
        setImageStatus({
          readySrc: props.src,
          loaded: true,
        })
      })
    }
  }, getImagePropsToUpdateAll(props))

  if (!(props.load ?? true)) {
    return { readySrc: blank, loaded: false, setImageStatus }
  }

  return { readySrc: readySrc || blank, loaded, setImageStatus }
}
