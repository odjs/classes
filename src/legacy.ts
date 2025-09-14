import { classes } from './classes'

import type {
  DeprecatedState,
  ClassArray as ModernClassArray,
  ClassesState as ModernClassesState,
  ClassItem as ModernClassItem,
  ClassObject as ModernClassObject,
  IsClassPresent as ModernIsClassPresent,
  ResolveClass as ModernResolveClass,
} from './types'

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace classes {
  export type CurrentState = DeprecatedState
  export type NormalizedClassObject = ModernClassesState

  export type IsClassPresent = ModernIsClassPresent
  export type ResolveClass = ModernResolveClass
  export type ClassObject = ModernClassObject
  export type ClassName = ModernClassItem
  export type ClassArray = ModernClassArray
}

export default classes
