import { classes } from './sorted'

test('Should return class name from object', () => {
  const classObj = { class1: false, 'class2 class3': true, class4: false }
  expect(classes(classObj)).toBe('class2 class3')
})

test('Should call function in object', () => {

  const returnTruthy = jest.fn(() => 1)
  const returnFalsy = jest.fn(() => 0)

  const classObj = {
    'class1 class2': returnTruthy,
    class3: returnFalsy,
    class4: returnTruthy,
    'class5 class6': returnFalsy,
  }

  expect(classes(classObj)).toBe('class1 class2 class4')
  expect(returnTruthy).toHaveBeenCalledTimes(2)
  expect(returnFalsy).toHaveBeenCalledTimes(2)

})

test('Should call function in object with current state', () => {

  const returnTrue = jest.fn<true, [unknown, string[]]>(() => true)

  const classObj1 = { 'class2 class3': returnTrue }
  const classObj2 = { class4: returnTrue }

  expect(classes('class1', classObj1, classObj2)).toBe('class1 class2 class3 class4')

  expect(returnTrue).toHaveBeenCalledTimes(2)
  expect(returnTrue).toHaveBeenNthCalledWith(1, { class1: true }, ['class2', 'class3'])
  expect(returnTrue).toHaveBeenNthCalledWith(2, { class1: true, class2: true, class3: true }, ['class4'])

})

test('Should receive current normalized object', () => {

  const ifNotClass1 = jest.fn<boolean | undefined, [Partial<Record<string, boolean>>, string[]]>((curr) => !curr.class1)

  const classObj1 = { class1: ifNotClass1 }
  const classObj2 = { 'class2 class3': ifNotClass1 }

  expect(classes('class1', classObj1, classObj2)).toBe('class2 class3')

  expect(ifNotClass1).toHaveBeenCalledTimes(2)
  expect(ifNotClass1).toHaveBeenNthCalledWith(1, { class1: true }, ['class1'])
  expect(ifNotClass1).toHaveBeenNthCalledWith(2, {}, ['class2', 'class3'])

})
