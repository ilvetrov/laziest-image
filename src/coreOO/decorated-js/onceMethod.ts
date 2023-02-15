/* eslint-disable no-extra-bind */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/ban-types */

const onceForPlainMethods: MethodDecorator = (target, _propertyKey, descriptor) => {
  if (!descriptor.value) {
    throw new Error('method is undefined')
  }

  if (typeof descriptor.value !== 'function') {
    throw new Error('method is not a method')
  }

  const method = descriptor.value

  const cachedValues = new WeakMap()

  descriptor.value = function (this: typeof target, ...args: []) {
    if (cachedValues.has(this)) {
      return cachedValues.get(this)
    }

    const result = method.apply(this, args)

    cachedValues.set(this, result)

    return result
  } as typeof descriptor.value

  return descriptor
}

const onceForGetter: MethodDecorator = (target, _propertyKey, descriptor) => {
  if (!descriptor.get) {
    throw new Error('method is undefined')
  }

  const method = descriptor.get

  const cachedValues = new WeakMap()

  descriptor.get = function (this: typeof target) {
    if (cachedValues.has(this)) {
      return cachedValues.get(this)
    }

    const result = method.apply(this)

    cachedValues.set(this, result)

    return result
  } as typeof descriptor.get

  return descriptor
}

const onceForSetter: MethodDecorator = (target, _propertyKey, descriptor) => {
  if (!descriptor.set) {
    throw new Error('method is undefined')
  }

  const method = descriptor.set

  let didSet = false

  descriptor.set = function (this: typeof target, value: any) {
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
