import { classes as classesNext } from './classes'
import type {
  ClassItem,
  ClassesState,
  DeprecatedState,
  ClassArray as _ClassArray,
  ClassObject as _ClassObject,
  IsClassPresent as _IsClassPresent,
  ResolveClass as _ResolveClass,
} from './types'

export function classes(...classNames: classes.ClassArray): string {
  return classesNext(classNames)
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace classes {
  export type CurrentState = DeprecatedState
  export type NormalizedClassObject = ClassesState

  export type IsClassPresent = _IsClassPresent
  export type ResolveClass = _ResolveClass
  export type ClassObject = _ClassObject
  export type ClassName = ClassItem
  export type ClassArray = _ClassArray
}

export default classes
