import type { ClassArray, ClassesState, ClassItem, ClassObject, DeprecatedState, IsClassPresent, ResolveClass } from './types'

function createDeprecatedState(state: ClassesState): DeprecatedState {
  return Object.entries(state).reduce((output, [cleanClassName, value]) => {
    if (!value) return output
    return { ...output, [cleanClassName]: true }
  }, {})
}

function cleanupClassName(dirtyClassName: string): string[] | undefined {
  const trimmedClassName = dirtyClassName.trim()
  if (!trimmedClassName) return
  return trimmedClassName.split(/\s+/)
}

function extendStateClean(input: ClassesState, cleanClassNames: string[], value: boolean): ClassesState {
  return cleanClassNames.reduce((state, cleanClassName) => {
    return { ...state, [cleanClassName]: value }
  }, input)
}

function processFunctionItem(state: ClassesState, resolveClass: ResolveClass): ClassesState {
  // Create current state
  const deprecatedState = createDeprecatedState(state)

  // Call resolver to get a class item
  const classItem = resolveClass(deprecatedState)

  // Process returned class item
  return processClassItem(state, classItem)
}

function processObjectItem(state: ClassesState, classObject: ClassObject): ClassesState {
  // FIXME: Optimize
  return Object.entries(classObject).reduce((_state, [key, value]) => {
    const cleanClassNames = cleanupClassName(key)
    if (!cleanClassNames) return _state

    // apply changes based on value if value is not a function
    if (typeof value !== 'function') {
      return extendStateClean(
        _state,
        cleanClassNames,
        !!value,
      )
    }

    // create current state
    const deprecatedState = createDeprecatedState(_state)

    // call value as function
    const isPresent = (value as IsClassPresent)(
      deprecatedState,
      [...cleanClassNames],
    )

    // Extend state with clean classnames
    return extendStateClean(
      _state,
      cleanClassNames,
      !!isPresent,
    )
  }, state)
}

function processClassItem(state: ClassesState, item: ClassItem): ClassesState {
  // Skip if item is nullish
  if (item == null) return state

  // Process item if it's a function
  if (typeof item === 'function') return processFunctionItem(state, item)

  // Process item if it's an array
  if (Array.isArray(item)) return processArray(state, item)

  // Process item if it's an object
  if (typeof item === 'object') return processObjectItem(state, item as ClassObject)

  // Convert user item to string
  // It is considered "dirty", so it has to be cleaned up
  const dirtyClassName = `${item as unknown}`
  const cleanClassNames = cleanupClassName(dirtyClassName)

  // Skip item if item couldn't be cleaned up
  if (!cleanClassNames) return state

  // Extend state with clean classnames
  return extendStateClean(
    state,
    cleanClassNames,
    true,
  )
}

export function processArray(state: ClassesState, classNames: ClassArray): ClassesState {
  return classNames.reduce(processClassItem, state)
}
