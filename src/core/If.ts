export function If<OnTrue, OnFalse>(
  onTrue: OnTrue,
  onFalse: OnFalse,
  condition: any,
): OnTrue | OnFalse {
  return condition ? onTrue : onFalse
}
