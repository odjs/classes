export type Dictionary<T> = Readonly<Record<string, T>>

export type UnknownArray = readonly unknown[] | unknown[]

export type IsArrayFunction = (value: unknown) => value is UnknownArray
