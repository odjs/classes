import hasOwn from "./has";
import { ClassName, ClassObject, OutputClassObject } from "./types";

function objToArr(object: ClassObject, normalize?: 1): string[] {
  if (normalize) {
    object = norm(object, {});
  }
  const result: string[] = [];
  for (const key in object) {
    if (hasOwn.call(object, key) && object[key]) {
      result.push(key);
    }
  }
  return result;
}

function objToStr(object: ClassObject, normalize?: 1): string {
  return objToArr(object, normalize).join(" ");
}

function strToObj(str: string, value: boolean, output: OutputClassObject): OutputClassObject {
  if (str) {
    const names = str.split(" ").filter(Boolean);
    const len = names.length;
    if (len) {
      for (let i = 0; i < len; i++) {
        output[names[i]] = value;
      }
    }
  }
  return output;
}

function norm(object: ClassObject, output: OutputClassObject): OutputClassObject {
  for (const key in object) {
    if (hasOwn.call(object, key)) {
      strToObj(
        key,
        Boolean(object[key]),
        output,
      );
    }
  }
  return output;
}

function arrToObj(array: ClassName[] | ArrayLike<ClassName>, output: OutputClassObject): OutputClassObject {
  const len = array.length;
  if (len) {
    for (let i = 0; i < len; i++) {
      classNameToObj(array[i], output);
    }
  }
  return output;
}

function classNameToObj(className: ClassName, output: OutputClassObject): OutputClassObject {
  return Array.isArray(className)
    ? arrToObj(className, output)
    : (typeof className === "object")
      ? norm(className, output)
      : strToObj(className, true, output);
}

function fromArray(array: ClassName[] | ArrayLike<ClassName>): string {
  return objToStr(
    arrToObj(
      array,
      {},
    ),
  );
}

function classes(...params: ClassName[]): string;
function classes(): string {
  return fromArray(
    arguments,
  );
}

function fromObj(object: ClassObject): string {
  return objToStr(object, 1);
}

export {
  classes,
  fromObj,
  fromArray,
};
