import {
  makeOptional,
  makeOptionalWithCustomOriginIndex,
  makeOptionalWithInteface,
} from './makeOptional'

interface IExample {
  data(): number
}

class Example implements IExample {
  constructor(private readonly dataInit: number) {}

  data(): number {
    return this.dataInit
  }
}

class ExampleTwiceData implements IExample {
  constructor(
    private readonly origin: IExample,
    public readonly o1?: number,
    public readonly o2?: number,
  ) {}

  data(): number {
    return this.origin.data() * 2
  }
}

const OptionalExampleTwiceData = makeOptional(ExampleTwiceData)
const OptionalExampleTwiceDataWithInteface = makeOptionalWithInteface<IExample>()(ExampleTwiceData)

testWithFirstOrigin('makeOptional', OptionalExampleTwiceData)
testWithFirstOrigin('makeOptionalWithInteface', OptionalExampleTwiceDataWithInteface as any)

function testWithFirstOrigin(name: string, ClassName: typeof OptionalExampleTwiceData) {
  describe(name, () => {
    it('reflects', () => {
      const decorated = new ClassName(new Example(100))

      expect(decorated.data()).toBe(200)
    })

    it('can be disabled', () => {
      const decorated = new ClassName(new Example(100), false)

      expect(decorated.data()).toBe(100)
    })

    it('can be disabled and enabled', () => {
      const decorated: IExample = new ExampleTwiceData(
        new ClassName(new ClassName(new Example(100), false), true),
      )

      expect(decorated.data()).toBe(400)
    })

    it('preserves arguments', () => {
      const decorated: IExample = new ClassName(new ClassName(new Example(100), false), true, 1, 2)

      expect(decorated.data()).toBe(200)
      expect((decorated as any).o1).toBe(1)
      expect((decorated as any).o2).toBe(2)
    })

    it('does not preserve arguments when false', () => {
      const decorated: IExample = new ClassName(new ClassName(new Example(100), false), false, 1, 2)

      expect(decorated.data()).toBe(100)
      expect((decorated as any).o1).toBe(undefined)
      expect((decorated as any).o2).toBe(undefined)
    })
  })
}

const OptionalExampleTwiceDataWithCustomIndex = makeOptionalWithCustomOriginIndex(
  ExampleTwiceData,
  0,
)

describe('makeOptionalWithCustomOriginIndex', () => {
  it('reflects', () => {
    const decorated = new OptionalExampleTwiceDataWithCustomIndex(true, new Example(100))

    expect(decorated.data()).toBe(200)
  })

  it('can be disabled', () => {
    const decorated = new OptionalExampleTwiceDataWithCustomIndex(false, new Example(100))

    expect(decorated.data()).toBe(100)
  })

  it('can be disabled and enabled', () => {
    const decorated: IExample = new ExampleTwiceData(
      new OptionalExampleTwiceDataWithCustomIndex(
        true,
        new OptionalExampleTwiceDataWithCustomIndex(false, new Example(100)),
      ),
    )

    expect(decorated.data()).toBe(400)
  })

  it('preserves arguments', () => {
    const decorated: IExample = new OptionalExampleTwiceDataWithCustomIndex(
      true,
      new OptionalExampleTwiceDataWithCustomIndex(false, new Example(100)),
      1,
      2,
    )

    expect(decorated.data()).toBe(200)
    expect((decorated as any).o1).toBe(1)
    expect((decorated as any).o2).toBe(2)
  })

  it('does not preserve arguments when false', () => {
    const decorated: IExample = new OptionalExampleTwiceDataWithCustomIndex(
      false,
      new OptionalExampleTwiceDataWithCustomIndex(false, new Example(100)),
      1,
      2,
    )

    expect(decorated.data()).toBe(100)
    expect((decorated as any).o1).toBe(undefined)
    expect((decorated as any).o2).toBe(undefined)
  })
})
