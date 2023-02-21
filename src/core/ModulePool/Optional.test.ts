import { Optional, OptionalInterface } from './Optional'

interface IExample {
  data(): number
}

function Example(dataInit: number): IExample {
  return {
    data: () => dataInit,
  }
}

interface IExampleMulti extends IExample {
  o1?: number
  o2?: number
}

function ExampleTwiceData(origin: IExample, o1?: number, o2?: number): IExampleMulti {
  return {
    data: () => origin.data() * 2,
    o1,
    o2,
  }
}

const OptionalExampleTwiceData = Optional(ExampleTwiceData)
const OptionalExampleTwiceDataWithInteface = OptionalInterface<IExample>()(ExampleTwiceData)

testWithFirstOrigin('Optional', OptionalExampleTwiceData)
testWithFirstOrigin('OptionalInterface', OptionalExampleTwiceDataWithInteface as any)

function testWithFirstOrigin(name: string, ClassName: typeof OptionalExampleTwiceData) {
  describe(name, () => {
    it('reflects', () => {
      const decorated = ClassName(Example(100))

      expect(decorated.data()).toBe(200)
    })

    it('can be disabled', () => {
      const decorated = ClassName(Example(100), false)

      expect(decorated.data()).toBe(100)
    })

    it('can be disabled and enabled', () => {
      const decorated: IExample = ExampleTwiceData(ClassName(ClassName(Example(100), false), true))

      expect(decorated.data()).toBe(400)
    })

    it('preserves arguments', () => {
      const decorated: IExample = ClassName(ClassName(Example(100), false), true, 1, 2)

      expect(decorated.data()).toBe(200)
      expect((decorated as any).o1).toBe(1)
      expect((decorated as any).o2).toBe(2)
    })

    it('does not preserve arguments when false', () => {
      const decorated: IExample = ClassName(ClassName(Example(100), false), false, 1, 2)

      expect(decorated.data()).toBe(100)
      expect((decorated as any).o1).toBe(undefined)
      expect((decorated as any).o2).toBe(undefined)
    })
  })
}
