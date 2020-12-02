type IsClassPresent = classes.IsClassPresent;
type NormalizedClassObject = classes.NormalizedClassObject;
type ClassName = classes.ClassName;

function each<V>(obj: Record<string, V>, cb: (val: V, key: string) => void): void;
function each<V, R>(obj: Record<string, V>, cb: (val: V, key: string, out: R) => R, out: R): R;
function each<V, R>(obj: Record<string, V>, cb: (val: V, key: string, out?: R) => R | undefined, out?: R): R | void {
  for (const key in obj) {
    if ({}.hasOwnProperty.call(obj, key)) {
      out = cb(obj[key], key, out);
    }
  }
  return out;
}

function normString(str: string, val: boolean, out: NormalizedClassObject): NormalizedClassObject {
  if (str) {
    const cns = str.split(' ');
    const { length: len } = cns;
    for (let i = 0; i < len; i++) {
      if (cns[i]) {
        out[cns[i]] = val;
      }
    }
  }
  return out;
}

function normArray(arr: ArrayLike<ClassName>, out: NormalizedClassObject): NormalizedClassObject {
  const { length: len } = arr;
  for (let i = 0; i < len; i++) {
    const value = arr[i];
    if (Array.isArray(value)) {
      normArray(value, out);
    } else if (value && typeof value === 'object') {
      let current: Record<string, boolean> | undefined;
      each(value, (value2, key) => {
        normString(
          key,
          !!(
            typeof value2 !== 'function' ? value2 : (value2 as IsClassPresent)(
              current || (
                current = each<boolean, NormalizedClassObject>(out, (value, key, r) => {
                  r[key] = value;
                  return r;
                }, {})
              ),
              key ? key.split(' ') : [],
            )
          ),
          out,
        );
      });
    } else {
      normString(`${value}`, true, out);
    }
  }
  return out;
}

function classes(...classnames: ClassName[]): string;
function classes(): string {
  return each(
    normArray(
      // eslint-disable-next-line prefer-rest-params
      arguments as ArrayLike<ClassName>,
      {},
    ),
    (incl, cn, res) => !incl ? res : res ? `${res} ${cn}` : cn,
    '',
  );
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace classes {
  export type IsClassPresent = (current: NormalizedClassObject, classnames: string[]) => unknown;
  export type ClassObject = Record<string, IsClassPresent | unknown>;
  export type NormalizedClassObject = Record<string, boolean>;
  export type ClassName = ClassArray | string | ClassObject | NormalizedClassObject;
  export type ClassArray = Array<ClassName>;
}

export default classes;
