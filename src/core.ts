import type { ClassArray, ClassesState, ClassItem, ClassObject, DeprecatedState, IsClassPresent, ResolveClass } from './types'

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
 * Extends the current state with the provided clean classnames and value
 */
function extendStateCleanBoolean(state: ClassesState, cleanClassNames: string[], value: boolean): ClassesState {
  return cleanClassNames.reduce((state, cleanClassName) => {
    return { ...state, [cleanClassName]: value }
  }, state)
}

/**
 * Extends the current state with the provided clean classnames and a possibly callable value
 */
function extendStateCleanCallable(state: ClassesState, cleanClassNames: string[], value: unknown): ClassesState {
  // If value is not a function...
  if (typeof value !== 'function') {
    // Extend state with cleaned up classnames and value as boolean
    return extendStateCleanBoolean(
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
  return extendStateCleanBoolean(
    state,
    cleanClassNames,
    !!isPresent,
  )
}

/**
 * Converts a "dirty" className into an array of "clean" classNames
 */
function cleanupClassName(dirtyClassName: string): string[] {
  return dirtyClassName.split(/\s+/).filter(Boolean)
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
  const dirtyClassEntries = Object.entries<unknown>(classObject)

  // Return updated state
  return dirtyClassEntries.reduce<ClassesState>((state, [dirtyClassName, value]) => {
    return extendStateCleanCallable(
      state,
      cleanupClassName(dirtyClassName),
      value,
    )
  }, state)
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
    case 'function': return processFunctionItem(state, classItem)

    // Process item if it's an array or object
    case 'object': {
      // Process item if it's an array
      if (Array.isArray(classItem)) return (classItem as ClassArray).reduce(processClassItem, state)

      // Process item if it's an object
      return processObjectItem(state, classItem as ClassObject)
    }
  }

  // Convert user item to string
  // It is considered "dirty", so it has to be cleaned up...
  // ...to check for empty or invalid strings
  const dirtyClassName = `${classItem as never}`

  return extendStateCleanBoolean(
    state,
    cleanupClassName(dirtyClassName),
    true,
  )
}
