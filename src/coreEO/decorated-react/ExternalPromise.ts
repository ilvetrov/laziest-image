export interface IExternalPromise<T = void> {
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
  then: Promise<T>['then']
  catch: Promise<T>['catch']
  finally: Promise<T>['finally']
  [Symbol.toStringTag]: 'Promise'
}

export class ExternalPromise<T = void> implements IExternalPromise<T> {
  public resolve!: (value: T | PromiseLike<T>) => void

  public reject!: (reason?: any) => void

  then: Promise<T>['then']

  catch: Promise<T>['catch']

  finally: Promise<T>['finally']

  constructor() {
    const promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })

    this.then = (...args) => promise.then(...args)
    this.catch = promise.catch
    this.finally = promise.finally
  }

  [Symbol.toStringTag] = 'Promise' as const
}
