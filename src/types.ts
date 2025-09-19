import type { Dictionary, UnknownArray } from './private-types'

export type DeprecatedState = Dictionary<true>
export type ClassesState = Dictionary<boolean>

export type IsClassPresent = (state: DeprecatedState, cleanClassNames: readonly string[]) => unknown
export type ResolveClass = (state: DeprecatedState) => ClassItem
export type ClassObjectValue = boolean | IsClassPresent | string | number | object | UnknownArray | null | undefined
export type ClassObject = Dictionary<ClassObjectValue>

export type ClassItem = string | boolean | number | null | undefined | ClassArray | ClassObject | ResolveClass
export type ClassArray = readonly ClassItem[]

export type ProcessClassItemFunction<I> = (state: ClassesState, classItem: I) => ClassesState
