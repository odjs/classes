import type { ProcessClassItemFunction } from './types'

export function createClassesFunction<I>(processClassItem: ProcessClassItemFunction<I>) {
  return (...classNames: readonly I[]) => {
    // Create state from class item
    const state = classNames.reduce(processClassItem, {})

    // Get clean class names from state
    const classNamesFromState = Object.keys(state)

    // Return class name as string
    return classNamesFromState.filter((className) => state[className]).join(' ')
  }
}
