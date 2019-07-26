import { classes, fromObj } from "../src";

test("should return classname from classname", () => {

  const classname = "class1 class2";
  const result = classes(classname);

  expect(result).toBe(classname);

});

test("should return classname from multiple classnames", () => {

  const classname1 = "class1";
  const classname2 = "class2";
  const result = classes(classname1, classname2);

  expect(result).toBe(`${classname1} ${classname2}`);

});

test("should return empty classname from empty string", () => {

  const classname = "";
  const result = classes(classname);

  expect(result).toBe("");

});

test("should return empty classname from space string", () => {

  const classname = "   ";
  const result = classes(classname);

  expect(result).toBe("");

});

test("should return classname from array ignoring extra spaces", () => {

  const classArray = [
    " class1 ",
    { " class2    class3 ": true, "class4": false },
    [" class5 ", " class6 "],
    { class3: false },
  ];
  const result = classes(classArray);

  expect(result).toBe("class1 class2 class5 class6");

});

test("should return classname from object", () => {

  const classObj = { "class1": false, "class2 class3": true, "class2": false };
  const result = classes(classObj);

  expect(result).toBe("class3");

});

test("should return classname from object using fromObj", () => {

  const classObj = { "class1": false, "class2 class3": true, "class2": false };
  const result = fromObj(classObj);

  expect(result).toBe("class2 class3");

});

test("should return normalized classname from object using fromObj", () => {

  const classObj = { "class1": false, "class2 class3": true, "class2": false };
  const result = fromObj(classObj, true);

  expect(result).toBe("class3");

});

function LegacyClassObject() {
  // @ts-ignore
  this.class1 = true;
}

LegacyClassObject.prototype.class2 = true;

test("should ignore object prototype properties using classes method", () => {

  // @ts-ignore
  const classObj = new LegacyClassObject();
  const result = classes(classObj);

  expect(result).toBe("class1");

});

test("should ignore object prototype properties using fromObj method", () => {

  // @ts-ignore
  const classObj = new LegacyClassObject();
  const result = fromObj(classObj);

  expect(result).toBe("class1");

});
