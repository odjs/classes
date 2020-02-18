type IsClassPresent = (current: NormalizedClassObject) => unknown
type ClassObject = Record<string, IsClassPresent | unknown>
type NormalizedClassObject = Record<string, boolean>
type ClassName = ClassArray | string | ClassObject | NormalizedClassObject
type ClassArray = Array<ClassName>

// eslint-disable-next-line @typescript-eslint/unbound-method
const hasOwn = {}.hasOwnProperty

function normString(str: string, value: boolean, output: NormalizedClassObject): NormalizedClassObject {

  if (str) {

    const cns = str.split(' ')

    for (let i = 0, len = cns.length; i < len; i++) {
      if (cns[i]) {
        output[cns[i]] = value
      }
    }

  }

  return output

}

function normObj(object: ClassObject, output: NormalizedClassObject): NormalizedClassObject {

  for (const key in object) {
    if (hasOwn.call(object, key)) {

      let value = object[key]

      if (typeof value === 'function') {
        value = (value as IsClassPresent)({ ...output })
      }

      normString(
        key,
        !!value,
        output,
      )

    }
  }

  return output

}

function normArray(array: ArrayLike<ClassName>, output: NormalizedClassObject): NormalizedClassObject {

  for (let i = 0, len = array.length; i < len; i++) {

    const value = array[i]

    if (Array.isArray(value)) {
      normArray(value, output)
    } else if (value && typeof value === 'object') {
      normObj(value, output)
    } else {
      normString(`${value}`, true, output)
    }

  }

  return output

}

function stringify(object: ClassObject): string {

  let result = ''

  for (const cn in object) {
    if (hasOwn.call(object, cn) && object[cn]) {
      result = result ? `${result} ${cn}` : cn
    }
  }

  return result

}

function classes(...classnames: ClassName[]): string;
function classes(): string {
  return stringify(
    normArray(
      // eslint-disable-next-line prefer-rest-params
      arguments as ArrayLike<ClassName>,
      {},
    ),
  )
}

export default classes
