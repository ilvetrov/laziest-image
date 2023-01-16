export interface IImage {
  readySrc(): string
  loaded(): boolean
}

export class Image implements IImage {
  constructor(private readonly src: string) {}

  public readySrc(): string {
    return this.src
  }

  public loaded(): boolean {
    return true
  }
}
