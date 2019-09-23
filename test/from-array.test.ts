import { sorted } from "./sorted";

test("should return classname from array ignoring extra spaces", () => {

  const classArray = [
    " class1 ",
    { " class2    class3 ": true, "class4": false },
    [" class5 ", " class6 "],
    { class3: false },
  ];
  const result = sorted(classArray);

  expect(result).toBe("class1 class2 class5 class6");

});
