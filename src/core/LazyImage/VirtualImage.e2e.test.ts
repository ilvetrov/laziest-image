/* eslint-disable @typescript-eslint/ban-types */
import { describeE2E } from '../../../e2e/testUsage/testUsage'
import { NonNullableValue } from '../NonNullable/NonNullableValue'
import { ISrc } from '../Src/Src'

function MockEmptySrc(): ISrc {
  return {
    src: '',
    srcSet: '',
    sizes: '',
    loaded: false,
  }
}

function MockSrc(): ISrc {
  const src = `https://picsum.photos/100/100.jpg`

  return {
    src,
    srcSet: `${src}?w=200 200w, ${src}?w=500 500w, ${src} 1000w`,
    sizes: '(max-width: 500px) 10px, (max-width: 1000px) 250px, 100vw',
    loaded: false,
  }
}

describeE2E('VirtualImage', ({ page, window }) => {
  it('loads', async () => {
    const mockSrc = MockSrc()

    const result = await page().evaluate((mockSrcInner) => {
      return new Promise<ISrc>((resolve, reject) => {
        try {
          const virtualImage = window.VirtualImage(mockSrcInner, false)

          virtualImage.src().onChange((src) => resolve(src))

          virtualImage.load()
        } catch (error) {
          reject(error)
        }
      })
    }, mockSrc)

    expect(result).toEqual({ ...mockSrc, loaded: true })
  }, 100_000)

  it('does not load immediately', async () => {
    const mockSrc = MockSrc()
    const mockEmptySrc = MockEmptySrc()

    const result = await page().evaluate(
      (mockSrcInner, mockEmptySrcInner) => {
        return new Promise<ISrc>((resolve, reject) => {
          try {
            const virtualImage = window.VirtualImage(mockSrcInner, false)

            virtualImage.src().onChange((src) => resolve(src))

            virtualImage.load()
          } catch (error) {
            reject(error)
          }

          setTimeout(() => {
            resolve(mockEmptySrcInner)
          }, 0)
        })
      },
      mockSrc,
      mockEmptySrc,
    )

    expect(result).toEqual(mockEmptySrc)
  }, 100_000)

  it('loads immediately from cache', async () => {
    const mockSrc = MockSrc()
    const mockEmptySrc = MockEmptySrc()

    await page().evaluate((mockSrcInner) => {
      return new Promise<ISrc>((resolve, reject) => {
        try {
          const virtualImage = window.VirtualImage(mockSrcInner, false)

          virtualImage.src().onChange((src) => resolve(src))

          virtualImage.load()
        } catch (error) {
          reject(error)
        }
      })
    }, mockSrc)

    const result = await page().evaluate(
      (mockSrcInner, mockEmptySrcInner) => {
        return new Promise<ISrc>((resolve, reject) => {
          try {
            const virtualImage = window.VirtualImage(mockSrcInner, false)

            virtualImage.src().onChange((src) => resolve(src))

            virtualImage.load()
          } catch (error) {
            reject(error)
          }

          setTimeout(() => {
            resolve(mockEmptySrcInner)
          }, 0)
        })
      },
      mockSrc,
      mockEmptySrc,
    )

    expect(result).toEqual({ ...mockSrc, loaded: true })
  }, 100_000)

  it('loads small on small screen', async () => {
    await page().setCacheEnabled(false)

    const mockSrc = MockSrc()

    const startViewport = NonNullableValue(page().viewport())

    function resizeWindowToDefault() {
      return page().setViewport(startViewport)
    }

    function resizeWindowToPhone() {
      return page().setViewport({
        width: 100,
        height: 100,
      })
    }

    await resizeWindowToPhone()

    const result = await page().evaluate((mockSrcInner) => {
      return new Promise<ISrc>((resolve, reject) => {
        try {
          const virtualImage = window.VirtualImage(mockSrcInner, true)

          virtualImage.src().onChange((src) => resolve(src))

          virtualImage.load()
        } catch (error) {
          reject(error)
        }
      })
    }, mockSrc)

    expect(result).toEqual({ ...mockSrc, loaded: true, src: `${mockSrc.src}?w=200` })

    await resizeWindowToDefault()

    await page().setCacheEnabled(true)
  }, 100_000)

  it('changes src after resize', async () => {
    await page().setCacheEnabled(false)

    const mockSrc = MockSrc()

    const startViewport = NonNullableValue(page().viewport())

    function resizeWindowToDefault() {
      return page().setViewport(startViewport)
    }

    function resizeWindowToPhone() {
      return page().setViewport({
        width: 100,
        height: 100,
      })
    }

    await resizeWindowToPhone()

    await page().exposeFunction('resizeWindowToDefault', resizeWindowToDefault)

    const result = await page().evaluate((mockSrcInner) => {
      return new Promise<ISrc>((resolve, reject) => {
        let resized = false

        try {
          const virtualImage = window.VirtualImage(mockSrcInner, true)

          virtualImage.src().onChange((src) => {
            if (!resized) {
              resizeWindowToDefault()
              resized = true
            } else {
              resolve(src)
            }
          })

          virtualImage.load()
        } catch (error) {
          reject(error)
        }
      })
    }, mockSrc)

    expect(result).toEqual({ ...mockSrc, loaded: true })

    await resizeWindowToDefault()

    await page().setCacheEnabled(true)
  }, 100_000)
})
