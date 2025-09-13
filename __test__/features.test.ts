import { createObjectWithPrototype } from './tools/create'
import { classes } from './tools/sorted'

test('Should normalize class name', () => {
  const messedUp = '  class1    class2  '
  const expected = 'class1 class2'
  expect(classes(messedUp)).toBe(expected)
  expect(classes([messedUp])).toBe(expected)
  expect(classes({ [messedUp]: true })).toBe(expected)
})

test('Should remove duplicated class names', () => {
  const expected = 'class1 class2'
  const classnames = [
    'class1',
    'class2',
    expected,
    ['class1'],
    ['class2'],
    [expected],
    ['class1', 'class2', expected],
    { class1: true },
    { class2: true },
    { [expected]: true },
    { class1: true, class2: true, [expected]: true },
  ]
  expect(classes(...classnames)).toBe(expected)
  expect(classes(classnames)).toBe(expected)
})

test('Should ignore empty strings, spaces, null and undefined', () => {
  const emptyString = ''
  const spaces = '    '
  const classnames = [
    emptyString,
    spaces,
    null,
    undefined,
    [emptyString, spaces, null, undefined],
    { [emptyString]: true, [spaces]: true },
  ]
  expect(classes(...classnames)).toBe(emptyString)
  expect(classes(classnames)).toBe(emptyString)
})

test('Should ignore object prototype properties', () => {
  const classObj = createObjectWithPrototype(
    { prototypeClass: true },
    { instanceClass: true },
  )

  expect(classObj.prototypeClass).toBe(true)
  expect(classObj.instanceClass).toBe(true)
  expect(classes(classObj)).toBe('instanceClass')
})

test('Should return even if incorrect type passes', () => {
  const classnames: Array<number | boolean> = [
    0,
    1,
    2,
    true,
    false,
  ]
  expect(classes(...classnames as never[])).toBe('0 1 2 false true')
  expect(classes(classnames as never[])).toBe('0 1 2 false true')
})
