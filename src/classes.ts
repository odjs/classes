import { processArray } from './core'
import type { ClassArray } from './types'

function arrayToArray(classItem: ClassArray): string[] {
  // Create state from class item
  const state = processArray({}, classItem)

  // Get clean classnames from state
  const classNames = Object.keys(state)

  // Return filtered classname
  return classNames.filter((className) => state[className])
}

export function classesToArray(...classNames: ClassArray): string[] {
  return arrayToArray(classNames)
}

export function classes(...classNames: ClassArray): string {
  return arrayToArray(classNames).join(' ')
}
