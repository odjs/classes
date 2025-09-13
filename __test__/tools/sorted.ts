import originalClassesFunction from '../../src'

export function classes(...names: originalClassesFunction.ClassName[]): string {
  const result = originalClassesFunction(...names)
  return result ? result.split(' ').sort().join(' ') : ''
}
