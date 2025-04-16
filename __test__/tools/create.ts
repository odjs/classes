export function createObjectWithPrototype<P extends Record<PropertyKey, unknown>, O extends Record<PropertyKey, unknown>>(prototype: P, properties: O): P & O {
  const entries = Object.entries(properties).map(([key, value]) => {
    const descriptor: PropertyDescriptor = {
      value,
      enumerable: true,
    }
    return [key, descriptor] as const
  })
  const descriptors = Object.fromEntries(entries)
  return Object.create(prototype, descriptors) as P & O
}
