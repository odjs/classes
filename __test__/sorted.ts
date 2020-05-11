import unsorted from '../src';

export function classes(...names: Parameters<typeof unsorted>): string {
  const result = unsorted(...names);
  return result ? result.split(' ').sort().join(' ') : result;
}
