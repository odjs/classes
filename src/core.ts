import type { ClassArray, ClassesState, ClassItem, ClassObject, DeprecatedState, IsClassPresent, ResolveClass } from './types'

// DO NO OPTIMIZE!!
//
// TODO: Implement function calls with whole state
//
// It will be removed in the future...
// ...as functions will receive the whole state
function deprecated_createState(state: ClassesState): DeprecatedState {
  return Object.entries(state).reduce((output, [cleanClassName, value]) => {
    if (!value) return output
    return { ...output, [cleanClassName]: true }
  }, {})
}

// Core functionalities

/**
 * Cleans up a "dirty" classname
 */
function cleanupClassName(dirtyClassName: string): string[] | undefined {
  // Fail if dirtyClassName is an empty string
  if (!dirtyClassName) return

  // Trim spaces form the beginning an end of the string
  const trimmedClassName = dirtyClassName.trim()

  // Fail if trimmedClassName is an empty string...
  // ...that means it was a string with spaces only
  if (!trimmedClassName) return

  // Split the into cleaned up parts
  return trimmedClassName.split(/\s+/)
}

/**
 * Extends the current state with the provided clean classnames and value
 */
function extendStateClean(state: ClassesState, cleanClassNames: string[], value: boolean): ClassesState {
  return cleanClassNames.reduce((state, cleanClassName) => {
    return { ...state, [cleanClassName]: value }
  }, state)
}

/**
 * Processes a function class item
 */
function processFunctionItem(state: ClassesState, resolveClass: ResolveClass): ClassesState {
  // Create current state
  const deprecatedState = deprecated_createState(state)

  // Call resolver to get a class item
  const classItem = resolveClass(deprecatedState)

  // Process returned class item
  return processClassItem(state, classItem)
}

/**
 * Processes a class object
 */
function processObjectItem(state: ClassesState, classObject: ClassObject): ClassesState {
  // Get object entries
  const dirtyClassEntries = Object.entries(classObject)

  // Return updated state
  return dirtyClassEntries.reduce<ClassesState>((state, [dirtyClassName, value]) => {
    // Try to clean up the string
    const cleanClassNames = cleanupClassName(dirtyClassName)

    // Skip item if classname couldn't be cleaned up
    if (!cleanClassNames) return state

    // If value is not a function...
    if (typeof value !== 'function') {
      // Extend state with cleaned up classnames and value as boolean
      return extendStateClean(
        state,
        cleanClassNames,
        !!value,
      )
    }

    // Create current state
    const deprecatedState = deprecated_createState(state)

    // Clone clean classnames to pass to the function
    const cleanClassNamesClone = [...cleanClassNames]

    // Call value as function to evaluate if classnames should be present
    const isPresent = (value as IsClassPresent)(deprecatedState, cleanClassNamesClone)

    // Extend state with clean classnames and function call result as boolean
    return extendStateClean(
      state,
      cleanClassNames,
      !!isPresent,
    )
  }, state)
}

/**
 * Processes a class item.
 * This is the core function, it decides what to do with every type of item
 */
function processClassItem(state: ClassesState, classItem: ClassItem): ClassesState {
  // Skip if item is nullish
  if (classItem == null) return state

  // Get item type
  const itemType = typeof classItem

  // Process item if it's a function
  if (itemType === 'function') return processFunctionItem(state, classItem as ResolveClass)

  // Process item if it's an array or object
  if (itemType === 'object') {
    // Process item if it's an array
    if (Array.isArray(classItem)) return processArray(state, classItem)

    // Process item if it's an object
    return processObjectItem(state, classItem as ClassObject)
  }

  // Convert user item to string
  // It is considered "dirty", so it has to be cleaned up...
  // ...to check for empty or invalid strings
  const dirtyClassName = `${classItem as never}`

  // Try to clean up the string
  const cleanClassNames = cleanupClassName(dirtyClassName)

  // Skip item if classname couldn't be cleaned up
  if (!cleanClassNames) return state

  // Extend state with clean classnames
  return extendStateClean(
    state,
    cleanClassNames,
    true,
  )
}

/**
 * Processes an array of item
 */
export function processArray(state: ClassesState, classNames: ClassArray): ClassesState {
  return classNames.reduce(processClassItem, state)
}
