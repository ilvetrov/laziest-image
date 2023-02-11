import { newRichFunction } from './RichFunction'

describe('RichFunction', () => {
  it('is callable', () => {
    const initFunc = (id: number) => String(id)

    const richFunc = newRichFunction(initFunc)

    expect(richFunc(1)).toBe('1')
  })
  it('has data', () => {
    const initFunc = (id: number) => String(id)

    const richFunc = newRichFunction(initFunc, {
      lastId: 0,
    })

    expect(richFunc.lastId).toBe(0)
  })
})
