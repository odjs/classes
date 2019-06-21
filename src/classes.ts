import { assign, keys } from "./helpers";
import { ClassName, ClassObject, OutputClassObject } from "./types";

function classObjectToArray(object: ClassObject): string[] {
  return keys(object).filter((name) => object[name]);
}

function classObjectToString(object: ClassObject): string {
  return classObjectToArray(object).join(" ");
}

function stringToClassObject(str: string, value: boolean): OutputClassObject {
  return str ? str.split(" ").filter(Boolean).reduce<OutputClassObject>((result, name) => {
    result[name] = value;
    return result;
  }, {}) : {};
}

function normClassObject(object: ClassObject): OutputClassObject {
  return keys(object).reduce<OutputClassObject>((result, name) => {
    return assign(
      result,
      stringToClassObject(
        name,
        Boolean(object[name]),
      ),
    );
  }, {});
}

function classArrayToObject(array: ClassName[]): OutputClassObject {
  return array.reduce<Record<string, any>>((result, value) => {
    return assign(
      result,
      classNameToObject(value),
    );
  }, {});
}

function classNameToObject(className: ClassName): OutputClassObject {
  return Array.isArray(
    className,
  ) ? classArrayToObject(
    className,
  ) : (typeof className === "object") ? normClassObject(
    className,
  ) : stringToClassObject(
    className,
    true,
  );
}

function classArrayToString(array: ClassName[]): string {
  return classObjectToString(
    classArrayToObject(
      array,
    ),
  );
}

function classNameToString(className: ClassName): string {
  return classObjectToString(
    classNameToObject(
      className,
    ),
  );
}

export {
  classNameToString as classes,
  classObjectToString as fromObj,
  classArrayToString as fromArray,
};
