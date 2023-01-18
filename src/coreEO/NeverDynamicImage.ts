import cached from './cached'
import { IDynamicImage, IDynamicImageStatus } from './DynamicImage'
import { NeverDynamic } from './NeverDynamic'
import { ReadOnlyDynamic } from './ReadOnlyDynamic'

export class NeverDynamicImage implements IDynamicImage {
  constructor(private readonly defaultValue: IDynamicImageStatus) {}

  public readonly status = cached(() => new ReadOnlyDynamic(new NeverDynamic(this.defaultValue)))

  load(): void {}

  destroy(): void {}
}
