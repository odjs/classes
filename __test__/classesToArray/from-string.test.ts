import { classesToArrayToString } from '../tools/sorted'

describe('passing strings to classesToArray function', () => {
  //

  test('Should return classname from a classname', () => {
    const className = 'class1 class2'
    expect(classesToArrayToString(className)).toBe(className)
  })

  test('Should return classname from multiple classnames', () => {
    const className1 = 'class1'
    const className2 = 'class2'
    expect(classesToArrayToString(className1, className2)).toBe(`${className1} ${className2}`)
  })
})
