export type ClassObject = Record<string, any>;
export type OutputClassObject = Record<string, boolean>;

interface ClassArray extends Array<ClassName> { }
export type ClassName = ClassArray | string | ClassObject;

// export interface Classes {
//   (className: ClassName): string;
//   fromObj: (object: ClassObject) => string;
//   fromArray: (array: ClassName[]) => string;
// }
