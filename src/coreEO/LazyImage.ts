import once from './decorated-js/onceMethod'
import { IReactive, Reactive } from './decorated-js/Reactive'

export interface ImageSrcData {
  src: string
  srcSet?: string
  sizes?: string
}

export interface ILazyImage {
  srcData(): Promise<IReactive<ImageSrcData>>
  defaultSrcData(): ImageSrcData
  destroy(): void
}

export class LazyImage implements ILazyImage {
  constructor(
    private readonly imageSrcData: ImageSrcData,
    private readonly defaultSrcDataPlain: ImageSrcData = { src: '' },
  ) {}

  @once
  async srcData(): Promise<IReactive<ImageSrcData>> {
    return new Reactive(
      () => this.imageSrcData,
      () => () => {},
    )
  }

  defaultSrcData(): ImageSrcData {
    return this.defaultSrcDataPlain
  }

  destroy(): void {}
}
