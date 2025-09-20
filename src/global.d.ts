import type { UnknownArray } from './private-types'

declare global {
  interface ArrayConstructor {
    isArray(value: unknown): value is UnknownArray
  }
}

export { }
