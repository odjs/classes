import { classes } from './tools/sorted'

describe('passing functions to classes function', () => {
  //

  test('Should return classname from resolved classname', () => {
    const expected = 'class1 class2'
    expect(classes(() => expected)).toBe(expected)
    expect(classes(() => () => () => expected)).toBe(expected)
  })

  test('Should return classname from multiple resolved classnames', () => {
    const resolveClassName1 = () => 'class1'
    const resolveClassName2 = () => 'class2'
    expect(classes(resolveClassName1, resolveClassName2)).toBe('class1 class2')
  })

  test('Should return classname from multiple classnames', () => {
    const resolveClassName = () => 'class3'
    const resolveArrayClassName = () => ['class1', 'class2', resolveClassName]
    expect(classes(resolveArrayClassName)).toBe('class1 class2 class3')
  })

  test('Should return classname from multiple classnames', () => {
    const resolveClassName = () => ({
      class1: true,
      class2: false,
      'class3 class4': true,
    })
    expect(classes(resolveClassName)).toBe('class1 class3 class4')
  })

  test('Should receive current classnames', () => {
    type CurrentState = Readonly<Record<string, true>>

    const removeClass1and2 = jest.fn<Record<string, boolean>, [CurrentState]>(() => ({ 'class1 class2': false }))
    const addClass4 = jest.fn<string, [CurrentState]>(() => 'class4')
    const addClass3and4 = jest.fn<[string, (current: CurrentState) => string], [CurrentState]>(() => ['class3', addClass4])

    expect(classes('class1 class4', removeClass1and2, addClass3and4)).toBe('class3 class4')

    expect(removeClass1and2).toHaveBeenCalledTimes(1)
    expect(removeClass1and2).toHaveBeenCalledWith({ class1: true, class4: true })

    expect(addClass4).toHaveBeenCalledTimes(1)
    expect(addClass4).toHaveBeenCalledWith({ class3: true, class4: true })

    expect(addClass3and4).toHaveBeenCalledTimes(1)
    expect(addClass3and4).toHaveBeenCalledWith({ class4: true })
  })
})
