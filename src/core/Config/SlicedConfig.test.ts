import { Config } from './Config'
import { RestConfig, SlicedConfigs } from './SlicedConfig'

describe('SlicedConfigs', () => {
  it('has properties', () => {
    const config = Config({ first: 111, second: 222, third: 333 })

    const [slice1, slice2] = SlicedConfigs(config, [['first'], ['second', 'third']] as const)

    expect(slice1.content().first).toBe(111)
    expect(slice2.content().second).toBe(222)
    expect(slice2.content().third).toBe(333)
  })

  it('has no rest properties', () => {
    const config = Config({ first: 111, second: 222, third: 333 })

    const [slice1, slice2] = SlicedConfigs(config, [['first'], ['second', 'third']] as const)

    expect((slice1.content() as any).second).toBe(undefined)
    expect((slice2.content() as any).first).toBe(undefined)
    expect(slice1.content()).toEqual({ first: 111 })
    expect(slice2.content()).toEqual({ second: 222, third: 333 })
  })
})

describe('RestConfig', () => {
  it('has properties', () => {
    const config = Config({ first: 111, second: 222, third: 333 })

    const [slice1] = SlicedConfigs(config, [['first']] as const)
    const restConfig = RestConfig(config, slice1)

    expect(restConfig.content().second).toBe(222)
    expect(restConfig.content().third).toBe(333)
  })

  it('has no properties from slice', () => {
    const config = Config({ first: 111, second: 222, third: 333 })

    const [slice1] = SlicedConfigs(config, [['first']] as const)
    const restConfig = RestConfig(config, slice1)

    expect((restConfig.content() as any).first).toBe(undefined)
    expect(restConfig.content()).toEqual({ second: 222, third: 333 })
  })
})
