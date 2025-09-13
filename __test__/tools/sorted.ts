import originalClassesFunction from '../../src'
import { classesToArray as originalClassesToArrayFunction } from '../../src/classes'

export function classes(...classNames: originalClassesFunction.ClassName[]): string {
  const className = originalClassesFunction(...classNames)
  return className ? className.split(' ').sort().join(' ') : ''
}

export function classesToArray(...classNames: originalClassesFunction.ClassName[]): string[] {
  const classArray = originalClassesToArrayFunction(...classNames)
  return classArray.sort()
}

export function classesToArrayToString(...classNames: originalClassesFunction.ClassName[]): string {
  return classesToArray(...classNames).join(' ')
}
