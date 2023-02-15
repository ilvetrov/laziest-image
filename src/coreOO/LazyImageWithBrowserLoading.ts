import localSyncState from 'local-sync-state'
import { browserSupportsLazyLoading } from '../core/browserSupportsLazyLoading'
import autobind from './decorated-js/autobind'
import { ControlledReactiveFromLocalSyncState } from './decorated-js/ControlledReactiveFromLocalSyncState'
import { Destroyers } from './decorated-js/Destroyers'
import once from './decorated-js/onceMethod'
import { IReactive } from './decorated-js/Reactive'
import { ReactiveFromReactive } from './decorated-js/ReactiveFromReactive'
import { ILazyImage, ImageSrcData } from './LazyImage'
import { makeOptional } from './LazyImageOptional'

@autobind
export class LazyImageWithBrowserLoading implements ILazyImage {
  constructor(private readonly origin: ILazyImage, private readonly finalSrc: ImageSrcData) {}

  private readonly destroyers = new Destroyers()

  @once
  async srcData(): Promise<IReactive<ImageSrcData>> {
    return new Promise((resolve) => {
      if (!browserSupportsLazyLoading) {
        const controlledReactive = new ControlledReactiveFromLocalSyncState(
          localSyncState(this.origin.defaultSrcData()),
        )

        this.destroyers.add(controlledReactive.unsubscribeAll)

        resolve(new ReactiveFromReactive(controlledReactive))

        this.origin.srcData().then((srcData) => {
          controlledReactive.changeValue(srcData.current())
          this.destroyers.add(srcData.onChange(controlledReactive.changeValue))
        })

        return
      }

      this.origin.srcData().then((srcData) => resolve(srcData))
    })
  }

  defaultSrcData(): ImageSrcData {
    return this.finalSrc
  }

  destroy(): void {
    this.destroyers.destroyAll()
    this.origin.destroy()
  }
}

export const LazyImageWithBrowserLoadingOptional = makeOptional(LazyImageWithBrowserLoading)
