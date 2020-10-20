type IsClassPresent = (current: NormalizedClassObject) => unknown;
type ClassObject = Record<string, IsClassPresent | unknown>;
type NormalizedClassObject = Record<string, boolean>;
type ClassName = ClassArray | string | ClassObject | NormalizedClassObject;
type ClassArray = Array<ClassName>;

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
      each(value, (value, key) => {
        normString(
          key,
          !!(
            typeof value !== 'function' ? value : (value as IsClassPresent)(
              current || (
                current = each<boolean, NormalizedClassObject>(out, (value, key, r) => {
                  r[key] = value;
                  return r;
                }, {})
              ),
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

export default classes;
