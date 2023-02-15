import { IReactiveMemory } from './ReactiveMemory'

export function OnlyNewReactiveMemory(origin: IReactiveMemory): IReactiveMemory {
  return {
    ...origin,

    write(key, value) {
      if (origin.read(key) !== value) {
        origin.write(key, value)
      }
    },
  }
}
