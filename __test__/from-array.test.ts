import { classes } from './tools/sorted'

describe('passing arrays to classes function', () => {
  //

  test('Should return classname from array', () => {
    const classArray = [
      'class1',
      ['class5', 'class6'],
      { 'class2 class3': true, class4: false },
      { class3: false },
      () => 'class7',
      () => ['class8'],
    ]
    expect(classes(classArray)).toBe('class1 class2 class5 class6 class7 class8')
  })
})
