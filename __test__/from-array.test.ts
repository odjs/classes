import { classes } from './sorted';

test('Should return class name from array', () => {
  const classArray = [
    'class1',
    ['class5', 'class6'],
    { 'class2 class3': true, 'class4': false },
    { class3: false },
  ];
  expect(classes(classArray)).toBe('class1 class2 class5 class6');
});
