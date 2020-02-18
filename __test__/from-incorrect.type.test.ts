import { classes } from './sorted'

test('should return even if incorrect type passes', () => {
  let undef: undefined
  const args: Array<number | boolean | null | undefined> = [0, 1, 2, true, false, null, undef]
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  expect(classes(...args)).toBe('0 1 2 false null true undefined')
})
