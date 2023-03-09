export type IIf<OnTrue, OnFalse> = () => OnTrue | OnFalse

export function If<OnTrue, OnFalse>(
  condition: any,
  onTrue: () => OnTrue,
  onFalse: () => OnFalse,
): IIf<OnTrue, OnFalse> {
  return () => (condition ? onTrue() : onFalse())
}
