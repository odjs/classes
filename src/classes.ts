import { processArray } from './core'
import type { ClassArray } from './types'

/**
 * Converts and array of class items into an array of "clean" classnames
 *
 * @param classItem An array to be processes
 * @returns An array of "clean" classnames
 */
function arrayToArray(classItem: ClassArray): string[] {
  // Create state from class item
  const state = processArray({}, classItem)

  // Get clean classnames from state
  const classNames = Object.keys(state)

  // Return filtered classname
  return classNames.filter((className) => state[className])
}

/**
 * Converts a series of class items into an array of "clean" classnames
 *
 * @param classNames A series of class items to be processed
 * @returns An array of "clean" classnames
 */
export function classesToArray(...classNames: ClassArray): string[] {
  return arrayToArray(classNames)
}

/**
 * Converts a series of class items into a normalized classname string
 *
 * @param classNames A series of class items to be processed
 * @returns A normalize classname string
 */
export function classes(...classNames: ClassArray): string {
  return arrayToArray(classNames).join(' ')
}
