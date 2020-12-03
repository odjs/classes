import { classes } from './sorted';

test('Should return class name from resolved class name', () => {
  expect(classes(() => 'class1 class2')).toBe('class1 class2');
  expect(classes(() => () => () => 'class1 class2')).toBe('class1 class2');
});

test('Should return class name from multiple resolved class names', () => {
  const resolveClassName1 = () => 'class1';
  const resolveClassName2 = () => 'class2';
  expect(classes(resolveClassName1, resolveClassName2)).toBe('class1 class2');
});

test('Should return class name from multiple class names', () => {
  const resolveClassName = () => 'class3';
  const resolveArrayClassName = () => ['class1', 'class2', resolveClassName];
  expect(classes(resolveArrayClassName)).toBe('class1 class2 class3');
});

test('Should return class name from multiple class names', () => {
  const resolveClassName = () => ({
    class1: true,
    class2: false,
    'class3 class4': true,
  });
  expect(classes(resolveClassName)).toBe('class1 class3 class4');
});

test('Should receive current classnames', () => {
  type CurrentState = Readonly<Record<string, true>>;
  const removeClass12 = jest.fn<Record<string, boolean>, [CurrentState]>(() => ({ 'class1 class2': false }));
  const addClass4 = jest.fn<string, [CurrentState]>(() => 'class4');
  const addClass34 = jest.fn<[string, (current: CurrentState) => string], [CurrentState]>(() => ['class3', addClass4]);
  expect(classes('class1 class4', removeClass12, addClass34)).toBe('class3 class4');
  expect(removeClass12).toHaveBeenCalledTimes(1);
  expect(addClass4).toHaveBeenCalledTimes(1);
  expect(addClass34).toHaveBeenCalledTimes(1);
  expect(removeClass12).toHaveBeenCalledWith({ class1: true, class4: true });
  expect(addClass4).toHaveBeenCalledWith({ class3: true, class4: true });
  expect(addClass34).toHaveBeenCalledWith({ class4: true });
});
