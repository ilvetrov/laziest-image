import once from './decorated-js/onceMethod'
import { IReactive, Reactive } from './decorated-js/Reactive'

export interface ImageSrcData {
  src: string
  srcSet?: string
  sizes?: string
}

export interface ILazyImage {
  srcData(): Promise<IReactive<ImageSrcData>>
  destroy(): void
}

export class LazyImage implements ILazyImage {
  constructor(private readonly imageSrcData: ImageSrcData) {}

  @once
  async srcData(): Promise<IReactive<ImageSrcData>> {
    return new Reactive(
      () => this.imageSrcData,
      () => () => {},
    )
  }

  destroy(): void {}
}
