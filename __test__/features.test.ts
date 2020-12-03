import { classes } from './sorted';

test('Should normalize class name', () => {
  expect(classes('  class1    class2  ')).toBe('class1 class2');
  expect(classes(['  class1    class2  '])).toBe('class1 class2');
  expect(classes({ '  class1    class2  ': true })).toBe('class1 class2');
});

test('Should remove duplicated class names', () => {
  const classnames = [
    'class1',
    'class2',
    'class1 class2',
    ['class1'],
    ['class2'],
    ['class1 class2'],
    ['class1', 'class2', 'class1 class2'],
    { class1: true },
    { class2: true },
    { 'class1 class2': true },
    { class1: true, class2: true, 'class1 class2': true },
  ];
  expect(classes(...classnames)).toBe('class1 class2');
  expect(classes(classnames)).toBe('class1 class2');
});

test('Should ignore empty strings, spaces, null and undefined', () => {
  const emptyString = '';
  const spaces = '    ';
  const classnames = [
    emptyString,
    spaces,
    null,
    undefined,
    [emptyString, spaces, null, undefined],
    { [emptyString]: true, [spaces]: true },
  ];
  expect(classes(...classnames)).toBe('');
  expect(classes(classnames)).toBe('');
});

test('Should ignore object prototype properties', () => {

  const classObj = Object.assign(
    Object.create({ prototypeClass: true }),
    { instanceClass: true },
  ) as { prototypeClass: true, instanceClass: true };

  expect(classObj.prototypeClass).toBe(true);
  expect(classes(classObj)).toBe('instanceClass');

});

test('Should return even if incorrect type passes', () => {
  const classnames: Array<number | boolean> = [
    0,
    1,
    2,
    true,
    false,
  ];
  expect(classes(...classnames as never[])).toBe('0 1 2 false true');
  expect(classes(classnames as never[])).toBe('0 1 2 false true');
});
