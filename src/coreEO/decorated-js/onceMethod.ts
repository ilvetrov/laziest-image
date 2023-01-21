/* eslint-disable @typescript-eslint/ban-types */

const onceForPlainMethods: MethodDecorator = (_target, _propertyKey, descriptor) => {
  if (!descriptor.value) {
    throw new Error('method is undefined')
  }

  if (typeof descriptor.value !== 'function') {
    throw new Error('method is not a method')
  }

  const method = descriptor.value

  let cachedValue: unknown

  descriptor.value = function (this: typeof _target, ...args: []) {
    if (cachedValue) {
      return cachedValue
    }

    const result = method.apply(this, args)

    cachedValue = result

    return result
  } as typeof descriptor.value

  return descriptor
}

const onceForGetter: MethodDecorator = (_target, _propertyKey, descriptor) => {
  if (!descriptor.get) {
    throw new Error('method is undefined')
  }

  const method = descriptor.get

  let cachedValue: unknown

  descriptor.get = function (this: typeof _target) {
    if (cachedValue) {
      return cachedValue
    }

    const result = method.apply(this)

    cachedValue = result

    return result
  } as typeof descriptor.get

  return descriptor
}

const onceForSetter: MethodDecorator = (_target, _propertyKey, descriptor) => {
  if (!descriptor.set) {
    throw new Error('method is undefined')
  }

  const method = descriptor.set

  let didSet = false

  descriptor.set = function (this: typeof _target, value: any) {
    if (didSet) {
      return
    }

    method.apply(this, [value])

    didSet = true
  }

  return descriptor
}

const once: MethodDecorator = (target, propertyKey, descriptor) => {
  if (!descriptor.value && !descriptor.get && !descriptor.set) {
    throw new Error('method is undefined')
  }

  if (typeof descriptor.value === 'function') {
    return onceForPlainMethods(target, propertyKey, descriptor)
  }

  if (typeof descriptor.get === 'function') {
    return onceForGetter(target, propertyKey, descriptor)
  }

  return onceForSetter(target, propertyKey, descriptor)
}

export default once
