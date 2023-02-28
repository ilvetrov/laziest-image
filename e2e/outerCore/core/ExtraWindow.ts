export interface IExtraWindow<Extra extends Record<string, any>> {
  content(): Omit<Extra, keyof Window> & Window
  fill(): void
  add<NewExtra extends Record<string, any>>(newExtra: NewExtra): IExtraWindow<Extra & Omit<NewExtra, keyof Extra>>
}

export function ExtraWindow<Extra extends Record<string, any>>(extra: Extra): IExtraWindow<Extra> {
  return {
    content() {
      return window as any as Omit<Extra, keyof Window> & Window
    },
    fill() {
      Object.keys(extra).forEach((extraKey) => {
        if ((window as any)[extraKey] === undefined) {
          (window as any)[extraKey] = extra[extraKey]
        }
      })
    },
    add(newExtra) {
      return ExtraWindow({ ...newExtra, ...extra })
    },
  }
}
