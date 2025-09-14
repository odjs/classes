type Dictionary<T> = Readonly<Record<string, T>>

export type DeprecatedState = Dictionary<true>
export type ClassesState = Dictionary<boolean>

export type IsClassPresent = (state: DeprecatedState, classNames: readonly string[]) => unknown
export type ResolveClass = (state: DeprecatedState) => ClassItem
export type ClassObject = Dictionary<boolean | string | number | IsClassPresent | object | null | undefined>

export type ClassItem = string | boolean | number | null | undefined | ClassArray | ClassObject | ResolveClass
export type ClassArray = readonly ClassItem[]
