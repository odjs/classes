import type { ClassesFunction, ProcessClassItemFunction } from './types'

export function createClassesFunction<I>(processClassItem: ProcessClassItemFunction<I>): ClassesFunction<I> {
  return (...classNames) => {
    const
      // Create state from class items
      state = classNames.reduce(processClassItem, {}),
      // Get clean class names from state
      classNamesFromState = Object.keys(state)

    // Return class name as string
    return classNamesFromState.filter((className) => state[className]).join(' ')
  }
}
