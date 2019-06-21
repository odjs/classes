const { classes, fromArray, fromObj } = require("..");

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

  expect(result).toBe(classname);

});

test("should return classname from array", () => {

  const classArray = [
    "class1",
    { "class2 class3": true, class4: false },
    ["class5", "class6"],
    { class3: false },
  ];
  const result = classes(classArray);

  expect(result).toBe("class1 class2 class5 class6");

});

test("should return classname from array using fromArray", () => {

  const classArray = [
    "class1",
    { "class2 class3": true, class4: false },
    ["class5", "class6"],
    { class3: false },
  ];
  const result = fromArray(classArray);

  expect(result).toBe("class1 class2 class5 class6");

});

test("should return classname from object", () => {

  const classObj = { class1: false, "class2 class3": true, class2: false };
  const result = classes(classObj);

  expect(result).toBe("class3");

});

test("should return classname from object using fromObj", () => {

  const classObj = { class1: false, "class2 class3": true, class2: false };
  const result = fromObj(classObj);

  expect(result).toBe("class2 class3");

});

test("should return classname from normalized object using fromObj", () => {

  const classObj = { class1: false, "class2 class3": true, class2: false };
  const result = fromObj(classObj, true);

  expect(result).toBe("class3");

});
