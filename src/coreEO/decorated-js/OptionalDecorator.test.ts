import { ILazyImage, ImageSrcData, LazyImage } from '../LazyImage'
import { LazyImageInVisibleArea } from '../LazyImageInVisibleArea'
import optionalDecorator from './OptionalDecorator'
import { IReactive } from './Reactive'

describe('OptionalDecorator', () => {
  it('works with true', () => {
    const uba: ILazyImage = optionalDecorator(
      LazyImageInVisibleArea,
      new LazyImage({ src: '/output' }, { src: '/default' }),
      true,
      () => document.createElement('div'),
    )

    expect(uba.defaultSrcData().src).toBe('/default')
  })

  it('works with false', () => {
    const uba: ILazyImage = optionalDecorator(
      LazyImageInVisibleArea,
      new LazyImage({ src: '/output' }, { src: '/default' }),
      false,
      () => document.createElement('div'),
    )

    expect(uba.defaultSrcData().src).toBe('/default')
  })

  it('suppresses with true', () => {
    const uba: ILazyImage = optionalDecorator(
      class LazyImageWithSuppress implements ILazyImage {
        constructor(private readonly origin: ILazyImage) {}

        srcData(): Promise<IReactive<ImageSrcData>> {
          return this.origin.srcData()
        }

        defaultSrcData(): ImageSrcData {
          return {
            src: '',
          }
        }

        destroy(): void {
          this.origin.destroy()
        }
      },
      new LazyImage({ src: '/output' }, { src: '/default' }),
      true,
    )

    expect(uba.defaultSrcData().src).toBe('')
  })
})
