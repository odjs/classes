type IsClassPresent = classes.IsClassPresent;
type NormalizedClassObject = classes.NormalizedClassObject;
type ClassName = classes.ClassName;

function eachTrue(
  base: Record<string, unknown>,
  callback: (key: string) => void
): void;

function eachTrue<R>(
  base: Record<string, unknown>,
  callback: (key: string, output: R) => R,
  output: R
): R;

function eachTrue<R>(
  base: Record<string, unknown>,
  callback: (key: string, output?: R | undefined) => R | undefined,
  output?: R,
): R | undefined {
  for (const key in base) {
    if (base[key]) {
      output = callback(
        key,
        output,
      );
    }
  }
  return output;
}

function normStrings(names: string[], value: boolean, output: NormalizedClassObject): NormalizedClassObject {
  const { length } = names;
  for (let i = 0; i < length; i++) {
    if (names[i]) {
      output[names[i]] = value;
    }
  }
  return output;
}

function processItem(item: ClassName, output: NormalizedClassObject): void {
  if (item && typeof item === 'object') {
    if (Array.isArray(item)) {
      normArray(
        item,
        output,
      );
    } else {
      for (const key in item) {
        if ({}.hasOwnProperty.call(item, key)) {
          if (key) {
            let value = item[key];
            if (typeof value === 'function') {
              value = (value as IsClassPresent)(
                eachTrue<Record<string, true>>(
                  output,
                  (key, result) => {
                    result[key] = true;
                    return result;
                  },
                  {},
                ),
                key.split(' '),
              );
            }
            normStrings(
              key.split(' '),
              !!value,
              output,
            );
          }
        }
      }
    }
  } else if (typeof item === 'function') {
    processItem(
      item(
        eachTrue<Record<string, true>>(
          output,
          (key, result) => {
            result[key] = true;
            return result;
          },
          {},
        ),
      ),
      output,
    );
  } else if (item != null) {
    const names = `${item}`;
    if (names) {
      normStrings(
        names.split(' '),
        true,
        output,
      );
    }
  }
}

function normArray(array: ArrayLike<ClassName>, output: NormalizedClassObject): NormalizedClassObject {
  const { length } = array;
  for (let i = 0; i < length; i++) {
    const item = array[i];
    processItem(item, output);
  }
  return output;
}

function classes(...classnames: ClassName[]): string;
function classes(): string {
  return eachTrue(
    normArray(
      // eslint-disable-next-line prefer-rest-params
      arguments as ArrayLike<ClassName>,
      {},
    ),
    (name, result) => result ? `${result} ${name}` : name,
    '',
  );
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace classes {
  export type CurrentState = Readonly<Record<string, true>>;
  export type IsClassPresent = (current: CurrentState, classnames: string[]) => unknown;
  export type ResolveClass = (current: CurrentState) => ClassName;
  export type ClassObject = Record<string, IsClassPresent | unknown>;
  export type NormalizedClassObject = Record<string, boolean>;
  export type ClassName = string | ResolveClass | ClassArray | ClassObject | NormalizedClassObject | null | undefined | void;
  export type ClassArray = ClassName[];
}

export default classes;
