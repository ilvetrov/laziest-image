/* eslint-disable max-classes-per-file */
import cached from '../cached'
import { Guaranteed } from './guaranteed'

type Render<T> = (newValue: T) => void

export interface IDecoratedToReact<T> {
  reactiveValue(): T
  addRender(render: Render<T>): void
  callEffects(): void
  valueDependsOnEffects(): boolean
  callDestroyers(): void
}

export interface IReactLifetime<T> {
  render(newValue: T): void
  onEffect(callback: () => void): void
  onDestroy(callback: () => void): void
}

export class ReactLifetime<T> implements IReactLifetime<T> {
  constructor(
    private readonly renderFunc: Guaranteed<Render<T>>,
    private readonly effectsList: (() => void)[],
    private readonly destroyersList: (() => void)[],
  ) {}

  render(newValue: T): void {
    this.renderFunc.get((render) => render(newValue))
  }

  onEffect(callback: () => void): void {
    this.effectsList.push(callback)
  }

  onDestroy(callback: () => void): void {
    this.destroyersList.push(callback)
  }
}

export class DecoratedToReact<T> implements IDecoratedToReact<T> {
  constructor(private readonly initCallback: (lifetime: IReactLifetime<T>) => T) {}

  private readonly render = cached(() => new Guaranteed<Render<T>>())

  private readonly effectsList: (() => void)[] = []

  private readonly destroyersList: (() => void)[] = []

  private readonly lifetime: () => IReactLifetime<T> = cached(
    () => new ReactLifetime(this.render(), this.effectsList, this.destroyersList),
  )

  readonly reactiveValue = cached(() => this.initCallback(this.lifetime()))

  addRender(render: Render<T>): void {
    this.render().set(render)
  }

  callEffects(): void {
    this.effectsList.forEach((effect) => effect())
  }

  valueDependsOnEffects(): boolean {
    return this.effectsList.length > 0
  }

  callDestroyers(): void {
    this.destroyersList.forEach((destroyer) => destroyer())
  }
}
