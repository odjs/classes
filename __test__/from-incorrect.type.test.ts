import { sorted } from './sorted'

test('should return even if incorrect type passes', () => {

  let undef: undefined
  const args: any[] = [0, 1, 2, true, false, null, undef]
  const result = sorted(...args)

  expect(result).toBe('0 1 2 false null true undefined')

})
