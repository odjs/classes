import { classes } from './sorted';

test('should return even if incorrect type passes', () => {
  let undef: undefined;
  const args: Array<number | boolean | null | undefined> = [0, 1, 2, true, false, null, undef];
  expect(classes(...args as never[])).toBe('0 1 2 false null true undefined');
});
