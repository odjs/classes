type IsClassPresent = classes.IsClassPresent;
type NormalizedClassObject = classes.NormalizedClassObject;
type ClassName = classes.ClassName;

function each<V>(
  base: Record<string, V>,
  callback: (value: V, key: string) => void
): void;

function each<V, R>(
  base: Record<string, V>,
  callback: (value: V, key: string, output: R) => R,
  output: R
): R;

function each<V, R>(
  base: Record<string, V>,
  callback: (value: V, key: string, output?: R | undefined) => R | undefined,
  output?: R,
): R | undefined {
  for (const key in base) {
    if ({}.hasOwnProperty.call(base, key)) {
      output = callback(
        base[key],
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

function normArray(array: ArrayLike<ClassName>, output: NormalizedClassObject): NormalizedClassObject {

  const { length } = array;

  for (let i = 0; i < length; i++) {

    const item = array[i];

    if (item && typeof item === 'object') {
      if (Array.isArray(item)) {
        normArray(
          item,
          output,
        );
      } else {
        each(item, (value, key) => {
          if (key) {
            if (typeof value === 'function') {
              value = (value as IsClassPresent)(
                each<boolean, NormalizedClassObject>(
                  output,
                  (value, key, result) => {
                    result[key] = value;
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
        });
      }
    } else {
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

  return output;

}

function classes(...classnames: ClassName[]): string;
function classes(): string {
  return each(
    normArray(
      // eslint-disable-next-line prefer-rest-params
      arguments as ArrayLike<ClassName>,
      {},
    ),
    (include, name, result) => !include ? result : result ? `${result} ${name}` : name,
    '',
  );
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace classes {
  export type IsClassPresent = (current: NormalizedClassObject, classnames: string[]) => unknown;
  export type ClassObject = Record<string, IsClassPresent | unknown>;
  export type NormalizedClassObject = Record<string, boolean>;
  export type ClassName = ClassArray | string | ClassObject | NormalizedClassObject;
  export type ClassArray = ClassName[];
}

export default classes;
