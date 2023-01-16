import { IImage } from './Image'

export class ManualLoadedImage implements IImage {
  constructor(private readonly origin: IImage, private readonly load: boolean) {}

  readySrc(): string {
    return this.load ? this.origin.readySrc() : ''
  }

  loaded(): boolean {
    return this.load
  }
}
