type IsClassPresent = (current: NormalizedClassObject) => any;
type ClassObject = Record<string, any>;
type NormalizedClassObject = Record<string, boolean>;
type ClassName = ClassArray | string | ClassObject | NormalizedClassObject;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ClassArray extends Array<ClassName> { }

const hasOwn = {}.hasOwnProperty

function parseString(str: string, value: boolean, output: NormalizedClassObject): NormalizedClassObject {

  if (str) {

    const classnames = str.split(' ')

    for (let i = 0, len = classnames.length; i < len; i++) {
      if (classnames[i]) {
        output[classnames[i]] = value
      }
    }

  }

  return output

}

function normalize(object: ClassObject, output: NormalizedClassObject): NormalizedClassObject {

  for (const key in object) {
    if (hasOwn.call(object, key)) {

      let value = object[key]

      if (typeof value === 'function') {
        value = (value as IsClassPresent)({ ...output })
      }

      parseString(
        key,
        !!value,
        output,
      )

    }
  }

  return output

}

function parseArray(array: ArrayLike<ClassName>, output: NormalizedClassObject): NormalizedClassObject {

  for (let i = 0, len = array.length; i < len; i++) {

    const value = array[i]

    if (Array.isArray(value)) {
      parseArray(value, output)
    } else if (value && typeof value === 'object') {
      normalize(value, output)
    } else {
      parseString(`${value}`, true, output)
    }

  }

  return output

}

function stringify(object: ClassObject): string {

  let result = ''

  for (const classname in object) {
    if (hasOwn.call(object, classname) && object[classname]) {
      result = result ? `${result} ${classname}` : classname
    }
  }

  return result

}

function classes(...classnames: ClassName[]): string;
function classes(): string {
  return stringify(
    parseArray(
      // eslint-disable-next-line prefer-rest-params
      arguments as ArrayLike<ClassName>,
      {},
    ),
  )
}

export default classes
