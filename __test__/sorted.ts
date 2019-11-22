import classes from "../src";

type ClassNames = Parameters<typeof classes>;

export function sorted(...names: ClassNames): string {
  const result = classes(...names);
  return result ? result.split(" ").sort().join(" ") : result;
}