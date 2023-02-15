import once from './onceMethod'

describe('once decorator', () => {
  it('runs once', () => {
    let numberOfCalls = 0

    class Example {
      @once
      get() {
        numberOfCalls += 1

        return 123
      }
    }

    const example = new Example()

    example.get()
    example.get()

    expect(numberOfCalls).toBe(1)
  })

  it('works for private methods', () => {
    let numberOfCalls = 0

    class Example {
      @once
      private get() {
        numberOfCalls += 1

        return 123
      }

      getPublic() {
        return this.get()
      }
    }

    const example = new Example()

    example.getPublic()
    example.getPublic()

    expect(numberOfCalls).toBe(1)
  })

  it('works for async methods', async () => {
    let numberOfCalls = 0

    class Example {
      @once
      async get() {
        numberOfCalls += 1

        return 123
      }
    }

    const example = new Example()

    ;[example.get(), example.get(), example.get()].reduce((prev, current) => {
      expect(prev).toBe(current)

      return current
    })

    expect(await Promise.all([example.get(), example.get(), example.get()])).toEqual([
      123, 123, 123,
    ])

    expect(numberOfCalls).toBe(1)
  })

  it('has its own cache for each method', () => {
    let numberOfCalls = 0

    class Example {
      @once
      get() {
        numberOfCalls += 1

        return 123
      }

      @once
      get2() {
        numberOfCalls += 1

        return 123
      }
    }

    const example = new Example()

    // Attempt
    example.get()
    example.get2()

    // Attempt
    example.get()
    example.get2()

    expect(numberOfCalls).toBe(2)
  })

  it('does not affect uncalled methods', () => {
    let numberOfCalls = 0

    class Example {
      @once
      get() {
        numberOfCalls += 1

        return 123
      }

      @once
      get2() {
        numberOfCalls += 1

        return 123
      }
    }

    const example = new Example()

    // Attempt
    example.get()

    expect(numberOfCalls).toBe(1)
  })

  it('preserves this', () => {
    let thisFromOnced: any
    let thisFromNormal: any
    let normalMethodResultFromOnced: any

    class Example {
      @once
      get() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        thisFromOnced = this
        normalMethodResultFromOnced = this.getNormal()

        return 123
      }

      getNormal() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        thisFromNormal = this

        return 123
      }
    }

    const example = new Example()

    example.get()
    example.get()
    example.getNormal()

    expect(thisFromOnced).toBe(thisFromNormal)
    expect(thisFromOnced).toBe(example)
    expect(normalMethodResultFromOnced).toBe(123)
  })

  it('works with getter', () => {
    let numberOfCalls = 0

    class Example {
      @once
      get get() {
        numberOfCalls += 1

        return 123
      }
    }

    const example = new Example()

    const result1 = example.get
    const result2 = example.get

    expect(numberOfCalls).toBe(1)
    expect(result1).toBe(123)
    expect(result1).toBe(result2)
  })

  it('works with setter', () => {
    let numberOfCalls = 0

    class Example {
      value = 0

      @once
      set set(value: number) {
        numberOfCalls += 1

        this.value = value
      }
    }

    const example = new Example()

    example.set = 1
    example.set = 2

    expect(numberOfCalls).toBe(1)
    expect(example.value).toBe(1)
  })
})
