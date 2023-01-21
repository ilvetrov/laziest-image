import { LazyImage } from './LazyImage'

describe('LazyImage', () => {
  it('src is correct', async () => {
    const src = (await new LazyImage({ src: '/example.jpg' }).srcData()).current()

    expect(src.src).toEqual('/example.jpg')
  })
})
