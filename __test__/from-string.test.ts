import { classes } from './sorted'

test('should return classname from classname', () => {

  const classname = 'class1 class2'
  const result = classes(classname)

  expect(result).toBe(classname)

})

test('should return normalized classname', () => {

  const classname1 = 'class1'
  const classname2 = 'class2'
  const result = classes(`  ${classname1}   ${classname2}  `)

  expect(result).toBe(`${classname1} ${classname2}`)

})

test('should return classname from multiple classnames', () => {

  const classname1 = 'class1'
  const classname2 = 'class2'
  const result = classes(classname1, classname2)

  expect(result).toBe(`${classname1} ${classname2}`)

})

test('should return empty classname from empty string', () => {
  expect(classes('')).toBe('')
})

test('should return empty classname from space string', () => {
  expect(classes('    ')).toBe('')
})
