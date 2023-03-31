type KbPerSecond = () => number

export function InternetSpeed(
  start: () => number,
  end: () => number,
  sizeKb: () => number,
): KbPerSecond {
  return () => sizeKb() / (end() - start())
}
