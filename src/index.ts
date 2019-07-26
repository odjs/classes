export type ClassObject = Record<string, any>;
export type NormalizedClassObject = Record<string, boolean>;

interface ClassArray extends Array<ClassName> { }
export type ClassName = ClassArray | string | ClassObject;

const hasOwn = Object.prototype.hasOwnProperty;

function stringToObject(text: string, value: boolean, output: NormalizedClassObject): NormalizedClassObject {
  if (text) {
    const names = text.split(" ");
    for (let i = 0, len = names.length; i < len; i++) {
      if (names[i]) {
        output[names[i]] = value;
      }
    }
  }
  return output;
}

function normalizeObject(object: ClassObject, output: NormalizedClassObject): NormalizedClassObject {
  for (const key in object) {
    if (hasOwn.call(object, key)) {
      stringToObject(
        key,
        !!object[key],
        output,
      );
    }
  }
  return output;
}

function arrayToObject(array: ClassArray | ArrayLike<ClassName>, output: NormalizedClassObject): NormalizedClassObject {
  const len = array.length;
  if (len) {
    for (let i = 0; i < len; i++) {
      const clnm = array[i];
      if (Array.isArray(clnm)) {
        arrayToObject(clnm, output);
      } else if (typeof clnm === "object") {
        normalizeObject(clnm, output);
      } else {
        stringToObject(clnm, true, output);
      }
    }
  }
  return output;
}

export function fromObj(object: ClassObject, normalize?: boolean): string {
  if (normalize) {
    object = normalizeObject(object, {});
  }
  let result: string = "";
  for (const key in object) {
    if (hasOwn.call(object, key) && object[key]) {
      if (result) {
        result += " ";
      }
      result += key;
    }
  }
  return result;
}

export function classes(...names: ClassName[]): string;
export function classes(): string {
  return fromObj(
    arrayToObject(
      arguments,
      {},
    ),
  );
}

export { classes as fromArray };
