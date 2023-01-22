import { IReactive } from './decorated-js/Reactive'
import { ILazyImage, ImageSrcData } from './LazyImage'

export function makeOptional<D extends new (...args: any) => ILazyImage>(
  DecoratorConstructor: D,
  paramIndexOfOrigin = 0,
): new (useDecorator: boolean, ...args: ConstructorParameters<D>) => ILazyImage {
  return class LazyImageOptional implements ILazyImage {
    instance: ILazyImage

    constructor(useDecorator: boolean, ...args: ConstructorParameters<D>) {
      this.instance = useDecorator ? new DecoratorConstructor(...args) : args[paramIndexOfOrigin]
    }

    async srcData(): Promise<IReactive<ImageSrcData>> {
      return this.instance.srcData()
    }

    defaultSrcData(): ImageSrcData {
      return this.instance.defaultSrcData()
    }

    destroy(): void {
      this.instance.destroy()
    }
  }
}
