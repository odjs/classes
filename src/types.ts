export type ClassObject = Record<string, any>;
export type NormalizedClassObject = Record<string, boolean>;

interface ClassArray extends Array<ClassName> { }
export type ClassName = ClassArray | string | ClassObject;
