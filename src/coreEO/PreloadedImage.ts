import preloadImage from '../core/preloadImage'
import cached from './cached'
import { Destroyers } from './Destroyers'
import { IDynamicImage } from './DynamicImage'
import { DynamicWithSubscribeMiddleware } from './DynamicWithSubscribeMiddleware'
import { ReadOnlyDynamic } from './ReadOnlyDynamic'

export class PreloadedImage implements IDynamicImage {
  constructor(
    private readonly origin: IDynamicImage,
    private readonly srcSet?: string,
    private readonly sizes?: string,
  ) {}

  public readonly status = cached(
    () =>
      new ReadOnlyDynamic(
        new DynamicWithSubscribeMiddleware(this.origin.status(), async (value) => ({
          readySrc: await this.loadImage(value.readySrc),
          loaded: value.loaded,
        })),
      ),
  )

  private destroyers = cached(() => new Destroyers())

  private loadImage(src: string): Promise<string> {
    return new Promise((resolve) => {
      this.destroyers().add(
        preloadImage({
          src,
          srcSet: this.srcSet,
          sizes: this.sizes,
          keepWatching: false,
          onLoad: (newSrc) => {
            resolve(newSrc)
          },
        }),
      )
    })
  }

  load() {
    this.origin.load()
  }

  destroy(): void {
    this.origin.destroy()
    this.status().destroy()
    this.destroyers().destroyAll()
  }
}
