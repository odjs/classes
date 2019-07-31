type ClassObject = Record<string, any>;
type NormalizedClassObject = Record<string, boolean>;
interface ClassArray extends Array<ClassName> { }
type ClassName = ClassArray | string | ClassObject | NormalizedClassObject;

const hasOwn = Object.prototype.hasOwnProperty;

function parseString(
  text: string,
  value: boolean,
  output: NormalizedClassObject,
): NormalizedClassObject {
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

function normalize(
  object: ClassObject,
  output: NormalizedClassObject,
): NormalizedClassObject {
  for (const key in object) {
    if (hasOwn.call(object, key)) {
      parseString(
        key,
        !!object[key],
        output,
      );
    }
  }
  return output;
}

function parseArray(
  array: ClassName[] | ArrayLike<ClassName>,
  output: NormalizedClassObject,
): NormalizedClassObject {
  for (let i = 0, len = array.length; i < len; i++) {
    const clnm = array[i];
    if (Array.isArray(clnm)) {
      parseArray(clnm, output);
    } else if (typeof clnm === "object") {
      normalize(clnm, output);
    } else {
      parseString(clnm, true, output);
    }
  }
  return output;
}

function stringify(object: ClassObject): string {
  let result: string = "";
  for (const classname in object) {
    if (hasOwn.call(object, classname) && object[classname]) {
      result = result ? `${result} ${classname}` : classname;
    }
  }
  return result;
}

function classes(...names: ClassName[]): string;
function classes(): string {
  return stringify(
    parseArray(
      arguments as ArrayLike<ClassName>,
      {},
    ),
  );
}

export default classes;
