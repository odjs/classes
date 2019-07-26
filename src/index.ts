export type ClassObject = Record<string, any>;
export type NormalizedClassObject = Record<string, boolean>;

interface ClassArray extends Array<ClassName> { }
export type ClassName = ClassArray | string | ClassObject;

const hasOwn = Object.prototype.hasOwnProperty;

function strToObj(str: string, val: boolean, out: NormalizedClassObject): NormalizedClassObject {
  if (str) {
    const names = str.split(" ");
    const len = names.length;
    if (len) {
      for (let i = 0; i < len; i++) {
        const cn = names[i];
        if (cn) {
          out[names[i]] = val;
        }
      }
    }
  }
  return out;
}

function norm(obj: ClassObject, out: NormalizedClassObject): NormalizedClassObject {
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

function arrToObj(arr: ClassName[] | ArrayLike<ClassName>, out: NormalizedClassObject): NormalizedClassObject {
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

export function fromObj(object: ClassObject, mormalizeObject?: boolean): string;
export function fromObj(obj: ClassObject, normIt?: any): string {
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

export function classes(...names: ClassName[]): string;
export function classes(): string {
  return fromObj(
    arrToObj(
      arguments,
      {},
    ),
  );
}

export { classes as fromArray };
