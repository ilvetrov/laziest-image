import { createBlank } from './blank'

describe('blank', () => {
  it('creates correctly', () => {
    expect(createBlank(200, 100)).toBe(
      'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22200%22%20height%3D%22100%22%3E%3Crect%20width%3D%22200%22%20height%3D%22100%22%20fill%3D%22rgba(0%2C%200%2C%200%2C%200)%22%20%2F%3E%3C%2Fsvg%3E',
    )
  })
})
