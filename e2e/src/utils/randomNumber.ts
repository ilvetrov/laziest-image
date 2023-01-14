export default function randomNumber(min: number, max: number): number {
  if (min > max) {
    throw new Error('"max" must be equal to or greater than "min"')
  }

  return Math.floor(Math.random() * (max - min + 1)) + min
}
