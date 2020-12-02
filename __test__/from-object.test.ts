import { classes } from './sorted';

test('should return classname from object', () => {
  const classObj = { 'class1': false, 'class2 class3': true, 'class4': false };
  expect(classes(classObj)).toBe('class2 class3');
});

test('should call function in object', () => {

  const returnTruthy = jest.fn(() => 1);
  const returnFalsy = jest.fn(() => 0);

  const classObj = { 'class2 class3': returnTruthy, 'class4': returnFalsy };

  expect(classes(classObj)).toBe('class2 class3');
  expect(returnTruthy).toHaveBeenCalledTimes(1);
  expect(returnFalsy).toHaveBeenCalledTimes(1);

});

test('should call function in object with current state', () => {

  const returnTrue = jest.fn<true, [unknown, string[]]>(() => true);

  const classObj1 = { 'class2 class3': returnTrue };
  const classObj2 = { 'class4': returnTrue };

  expect(classes('class1', classObj1, classObj2)).toBe('class1 class2 class3 class4');
  expect(returnTrue).toHaveBeenCalledTimes(2);
  expect(returnTrue).toHaveBeenNthCalledWith(1, { class1: true }, ['class2', 'class3']);
  expect(returnTrue).toHaveBeenNthCalledWith(2, { class1: true, class2: true, class3: true }, ['class4']);

});

test('should receive current normalized object', () => {

  const ifClass5 = jest.fn<boolean | undefined, [Partial<Record<string, boolean>>, string[]]>((curr) => curr.class5);

  const classObj1 = { 'class2 class3': ifClass5 };
  const classObj2 = { class4: false };

  expect(classes('class5', classObj1, classObj2)).toBe('class2 class3 class5');
  expect(ifClass5).toHaveBeenCalledWith({ class5: true }, ['class2', 'class3']);

});

test('should ignore object prototype properties', () => {

  const classObj = Object.assign(
    Object.create({ prototypeClass: true }),
    { instanceClass: true },
  ) as { prototypeClass: true, instanceClass: true };

  expect(classObj.prototypeClass).toBe(true);
  expect(classes(classObj)).toBe('instanceClass');

});
