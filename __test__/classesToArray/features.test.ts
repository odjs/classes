import { createObjectWithPrototype } from '../tools/create'
import { classesToArrayToString } from '../tools/sorted'

describe('classesToArray function features', () => {
  //

  test('Should normalize classname', () => {
    const messedUp = '  class1    class2  '
    const expected = 'class1 class2'
    expect(classesToArrayToString(messedUp)).toBe(expected)
    expect(classesToArrayToString([messedUp])).toBe(expected)
    expect(classesToArrayToString({ [messedUp]: true })).toBe(expected)
    expect(classesToArrayToString(() => messedUp)).toBe(expected)
  })

  test('Should remove duplicated classnames', () => {
    const expected = 'class1 class2'
    const classnames = [
      'class1',
      'class2',
      expected,
      () => expected,
      ['class1'],
      ['class2'],
      [expected],
      ['class1', 'class2', expected],
      ['class1', 'class2', expected, () => expected],
      { class1: true },
      { class2: true },
      { [expected]: true },
      { [expected]: () => true },
      { class1: true, class2: true, [expected]: true },
    ]
    expect(classesToArrayToString(...classnames)).toBe(expected)
    expect(classesToArrayToString(classnames)).toBe(expected)
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
    expect(classesToArrayToString(...classnames)).toBe(emptyString)
    expect(classesToArrayToString(classnames)).toBe(emptyString)
  })

  test('Should ignore object prototype properties', () => {
    const classObj = createObjectWithPrototype(
      { prototypeClass: true },
      { instanceClass: true },
    )

    expect(classObj.prototypeClass).toBe(true)
    expect(classObj.instanceClass).toBe(true)
    expect(classesToArrayToString(classObj)).toBe('instanceClass')
  })

  // TODO: This will change in the next major release
  test('Should return numbers and booleans as classnames (for now...)', () => {
    const classnames: Array<number | boolean> = [
      0,
      1,
      2,
      true,
      false,
    ]
    expect(classesToArrayToString(...classnames)).toBe('0 1 2 false true')
    expect(classesToArrayToString(classnames)).toBe('0 1 2 false true')
  })
})
