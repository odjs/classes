import { cleanupClassName, deprecated_createState, extendStateClean } from './tools'
import type { ClassesState, ClassItem, IsClassPresent } from './types'

/**
 * Processes a class item.
 * This is the core function, it decides what to do with every type of item
 */
export function processClassItem(state: ClassesState, classItem: ClassItem): ClassesState {
  // Skip if item is nullish
  if (classItem == null) return state

  switch (typeof classItem) {
    // Process item if it's a function
    case 'function': return processClassItem(
      state,
      // Call resolver to get a class item
      classItem(
        // Create current state
        deprecated_createState(state),
      ),
    )

    // Process item if it's an array or object
    case 'object': return Array.isArray(classItem)
      ? classItem.reduce(processClassItem, state)
      : Object.entries(classItem).reduce<ClassesState>((state, [dirtyClassName, value]) => {
          // Cleanup class name
          const cleanClassNameList = cleanupClassName(dirtyClassName)

          // Prevent unnecessary function call if clean class name list is empty
          if (!cleanClassNameList.length) return state

          // Extend state with cleaned up class names and value as boolean if it's not a function
          if (typeof value !== 'function') return extendStateClean(state, cleanClassNameList, !!value)

          // Call value as function to evaluate if classnames should be present
          const isClassPresent = value as IsClassPresent, isPresent = isClassPresent(
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

  // Extend state
  return extendStateClean(
    state,
    cleanupClassName(`${classItem as never}`),
    true,
  )
}
