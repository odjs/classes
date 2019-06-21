import hasOwn from "./has";
import { ClassName, ClassObject, OutputClassObject } from "./types";

function objToStr(obj: ClassObject, normIt?: 1): string {
  if (normIt) {
    obj = norm(obj, {});
  }
  const arr: string[] = [];
  for (const key in obj) {
    if (hasOwn.call(obj, key) && obj[key]) {
      arr.push(key);
    }
  }
  return arr.join(" ");
}

function strToObj(str: string, val: boolean, out: OutputClassObject): OutputClassObject {
  if (str) {
    const names = str.split(" ").filter(Boolean);
    const len = names.length;
    if (len) {
      for (let i = 0; i < len; i++) {
        out[names[i]] = val;
      }
    }
  }
  return out;
}

function norm(obj: ClassObject, out: OutputClassObject): OutputClassObject {
  for (const key in obj) {
    if (hasOwn.call(obj, key)) {
      strToObj(
        key,
        Boolean(obj[key]),
        out,
      );
    }
  }
  return out;
}

function arrToObj(arr: ClassName[] | ArrayLike<ClassName>, out: OutputClassObject): OutputClassObject {
  const len = arr.length;
  if (len) {
    for (let i = 0; i < len; i++) {
      const clnm = arr[i];
      if (Array.isArray(clnm)) {
        arrToObj(clnm, out);
      } else if (typeof clnm === "object") {
        norm(clnm, out);
      } else {
        strToObj(clnm, true, out);
      }
    }
  }
  return out;
}

function fromArray(array: ClassName[] | ArrayLike<ClassName>): string;
function fromArray(arr: ClassName[] | ArrayLike<ClassName>): string {
  return objToStr(
    arrToObj(
      arr,
      {},
    ),
  );
}

function classes(...names: ClassName[]): string;
function classes(): string {
  return fromArray(
    arguments,
  );
}

function fromObj(object: ClassObject): string;
function fromObj(obj: ClassObject): string {
  return objToStr(obj, 1);
}

export {
  classes,
  fromObj,
  fromArray,
};
