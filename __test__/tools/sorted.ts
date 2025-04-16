import classesUnsorted from '../../src'

export function classes(...names: classesUnsorted.ClassName[]): string {
  const result = classesUnsorted(...names)
  return result ? result.split(' ').sort().join(' ') : ''
}
