import type { ClassesState, DeprecatedState } from './types'

// DO NOT OPTIMIZE!!
// It will be removed in the future...
// ...as functions will receive the whole state
//
// TODO: Implement function calls with whole state
export function deprecated_createState(state: ClassesState): DeprecatedState {
  return Object.keys(state).reduce((output, cleanClassName) => {
    if (!state[cleanClassName]) return output
    return { ...output, [cleanClassName]: true }
  }, {})
}

// Core functionalities

/**
 * Converts a "dirty" class name into an array of "clean" class names.
 * A "dirty" class name may content multiple class names and unwanted spaces.
 * A "clean" class name is a single class name without any space
 */
export function cleanupClassName(dirtyClassName: string): string[] {
  return dirtyClassName.split(/\s+/).filter(Boolean)
}

/**
 * Extends the current state with the provided clean classnames and value
 */
export function extendStateClean(state: ClassesState, cleanClassNameList: string[], value: boolean): ClassesState {
  return cleanClassNameList.reduce(
    (state, cleanClassName) => ({ ...state, [cleanClassName]: value }),
    state,
  )
}
