function createState(normalized: classes.NormalizedClassObject): classes.CurrentState {
  return Object.entries(normalized).reduce((output, [key, value]) => {
    if (!value) return output
    return { ...output, [key]: true }
  }, {})
}

function normalizeClassname(classname: string): string[] {
  // split classname by white spaces and filter out empty classnames
  return classname.split(/\s+/).filter((part) => part)
}

function extendNormalized(input: classes.NormalizedClassObject, classnamesNormalized: string[], value: boolean): classes.NormalizedClassObject {
  // return input if classnames is empty array
  if (!classnamesNormalized.length) return input

  // return extended input
  return classnamesNormalized.reduce(
    (output, classname) => ({ ...output, [classname]: value }),
    input,
  )
}

function normalizeItem(input: classes.NormalizedClassObject, item: classes.ClassName): classes.NormalizedClassObject {

  // if item is a function...
  if (typeof item === 'function') {
    // create current state
    const state = createState(input)

    // call item as function
    const itemResolved = item(state)

    // apply changes based on result
    return normalizeItem(
      input,
      itemResolved,
    )
  }

  // skip if item is nullish
  if (item == null) return input

  // call normalizeItem for every value if item is an array
  if (Array.isArray(item)) return item.reduce(normalizeItem, input)

  // if item is an object (but not array)...
  if (typeof item === 'object') {
    return Object.entries(item).reduce((output, [key, value]) => {
      // normalize class names
      const classnames = normalizeClassname(key)

      // apply changes based on value if value is not a function
      if (typeof value !== 'function') {
        return extendNormalized(
          output,
          classnames,
          !!value,
        )
      }

      // create current state
      const state = createState(output)

      // call value as function
      const isPresent = (value as classes.IsClassPresent)(
        state,
        classnames,
      )

      // apply changes based on value as function
      return extendNormalized(
        output,
        classnames,
        !!isPresent,
      )
    }, input)
  }

  // apply changes
  return extendNormalized(
    input,
    normalizeClassname(`${item as unknown}`),
    true,
  )
}

function classes(...classnames: classes.ClassName[]): string
function classes(): string {
  // eslint-disable-next-line prefer-rest-params
  const argumentNormalized = Array.from(arguments as Iterable<classes.ClassName>).reduce(normalizeItem, {})
  return Object.entries(argumentNormalized).reduce<string>((output, [classname, present]) => {
    if (!present) return output
    if (!output) return classname
    return `${output} ${classname}`
  }, '')
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace classes {
  type ClassObjectBase<T> = Readonly<Record<string, T>>

  export type CurrentState = ClassObjectBase<true>
  export type NormalizedClassObject = ClassObjectBase<boolean>

  export type IsClassPresent = (current: CurrentState, classnames: string[]) => unknown
  export type ResolveClass = (current: CurrentState) => ClassName
  export type ClassObject = ClassObjectBase<boolean | IsClassPresent | string | number | object | null | undefined>
  export type ClassName = string | ResolveClass | ClassArray | ClassObject | null | undefined
  export type ClassArray = ClassName[]
}

export default classes
