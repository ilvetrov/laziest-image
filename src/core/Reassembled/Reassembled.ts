export function Reassembled<
  Input extends Record<string | number | symbol, any>,
  Output extends Record<string | number | symbol, Input[string | number | symbol]>,
>(input: Input, output: (value: Input) => Output): Output {
  return output(input)
}
