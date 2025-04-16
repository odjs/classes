import { classes } from './tools/sorted'

test('Should return class name from class name', () => {
  const className = 'class1 class2'
  expect(classes(className)).toBe(className)
})

test('Should return class name from multiple class names', () => {
  const className1 = 'class1'
  const className2 = 'class2'
  expect(classes(className1, className2)).toBe(`${className1} ${className2}`)
})
