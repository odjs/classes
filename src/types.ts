export type Dictionary<T> = Readonly<Record<string, T>>
export type DeprecatedState = Dictionary<true>

export type ClassesState = Dictionary<boolean>

export type IsClassPresent = (current: DeprecatedState, classnames: readonly string[]) => unknown
export type ResolveClass = (current: DeprecatedState) => ClassItem
export type ClassObject = Dictionary<boolean | IsClassPresent | string | number | object | null | undefined>

export type ClassItem = string | boolean | number | null | undefined | ClassArray | ClassObject | ResolveClass
export type ClassArray = readonly ClassItem[]
