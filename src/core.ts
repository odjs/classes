import type { IsArrayFunction } from './private-types'
import type { ClassesState, ClassItem, DeprecatedState, IsClassPresent } from './types'

// DO NOT OPTIMIZE!!
// It will be removed in the future...
// ...as functions will receive the whole state
//
// TODO: Implement function calls with whole state
function deprecated_createState(state: ClassesState): DeprecatedState {
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
function cleanupClassName(dirtyClassName: string): string[] {
  return dirtyClassName.split(/\s+/).filter(Boolean)
}

/**
 * Extends the current state with the provided clean classnames and value
 */
function extendStateClean(state: ClassesState, cleanClassNameList: string[], value: boolean): ClassesState {
  return cleanClassNameList.reduce(
    (state, cleanClassName) => ({ ...state, [cleanClassName]: value }),
    state,
  )
}

/**
 * Processes a class item.
 * This is the core function, it decides what to do with every type of item
 */
export function processClassItem(state: ClassesState, classItem: ClassItem): ClassesState {
  // Skip if item is nullish
  if (classItem == null) return state

  switch (typeof classItem) {
    // Process item if it's a function
    case 'function': {
      // Process returned class item
      return processClassItem(
        state,
        // Call resolver to get a class item
        classItem(
          // Create current state
          deprecated_createState(state),
        ))
    }

    // Process item if it's an array or object
    case 'object': {
      // Process item if it's an array
      if ((Array.isArray as IsArrayFunction)(classItem))
        return classItem.reduce(processClassItem, state)

      // Get object entries
      const dirtyClassNameList = Object.entries(classItem)

      // Return updated state
      return dirtyClassNameList.reduce<ClassesState>((state, [dirtyClassName, value]) => {
        // Cleanup class name
        const cleanClassNameList = cleanupClassName(dirtyClassName)

        // If value is not a function...
        if (typeof value !== 'function') {
          // Extend state with cleaned up class names and value as boolean
          return extendStateClean(state, cleanClassNameList, !!value)
        }

        // Call value as function to evaluate if classnames should be present
        const isPresent = (value as IsClassPresent)(
          // Create current state
          deprecated_createState(state),
          // Clone clean class names to pass to the function...
          // ...so user can't change it
          [...cleanClassNameList],
        )

        // Extend state with clean class names and function call result as boolean
        return extendStateClean(state, cleanClassNameList, !!isPresent)
      }, state)
    }
  }

  // Convert item to string
  const dirtyClassName = `${classItem as never}`

  // Cleanup generated class name
  const cleanClassNameList = cleanupClassName(dirtyClassName)

  // Extend state
  return extendStateClean(state, cleanClassNameList, true)
}
