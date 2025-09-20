import originalClassesFunction from '../../src'

export function classes(...classNames: originalClassesFunction.ClassName[]): string {
  const className = originalClassesFunction(...classNames)
  return className ? className.split(' ').sort().join(' ') : ''
}
