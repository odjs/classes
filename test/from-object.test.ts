import LegacyClassObject from "./legacy";
import { sorted } from "./sorted";

test("should return classname from object", () => {

  const classObj = { "class1": false, "class2 class3": true, "class4": false };
  const result = sorted(classObj);

  expect(result).toBe("class2 class3");

});

test("should call function in object", () => {

  const returnTruthy = jest.fn(() => 1);
  const returnFalsy = jest.fn(() => 0);

  const classObj = { "class2 class3": returnTruthy, "class4": returnFalsy };
  const result = sorted(classObj);

  expect(result).toBe("class2 class3");
  expect(returnTruthy).toHaveBeenCalledTimes(1);
  expect(returnFalsy).toHaveBeenCalledTimes(1);

});

test("should receive current normalized object", () => {

  const ifClass5 = jest.fn((curr) => curr.class5);

  const classObj1 = { "class2 class3": ifClass5 };
  const classObj2 = { class4: false };
  const result = sorted("class5", classObj1, classObj2);

  expect(result).toBe("class2 class3 class5");
  expect(ifClass5).toHaveBeenCalledWith({ class5: true });

});

test("should ignore object prototype properties using classes method", () => {

  const classObj = new LegacyClassObject();
  const result = sorted(classObj);

  expect(result).toBe("class1");

});
