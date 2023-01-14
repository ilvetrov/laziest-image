import randomNumber from './randomNumber'
import uniqueId from './uniqueId'

function createImage(
  width: [number, number] = [1000, 2000],
  height: [number, number] = [400, 700],
) {
  return {
    id: uniqueId(),
    width: randomNumber(...width),
    height: randomNumber(...height),
    get src() {
      return `https://picsum.photos/${this.width}/${this.height}.jpg`
    },
  }
}

export type Image = ReturnType<typeof createImage>

const imagesCache: Record<string, Image[]> = {}

export function createImages(
  name: string,
  amount = 5,
  width: [number, number] = [1000, 2000],
  height: [number, number] = [400, 700],
): Image[] {
  if (!imagesCache[name]) {
    imagesCache[name] = Array(amount)
      .fill(undefined)
      .map(() => createImage(width, height))
  }

  return imagesCache[name]
}
