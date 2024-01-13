/**
 * Omit keys from an object.
 * @param obj The object to omit keys from.
 * @param keys The keys to omit.
 * @returns
 */
export const omit = <O extends object, K extends keyof O>(obj: O, ...keys: K[]): Omit<O, K> => {
  const result = { ...obj };
  for (const key of keys) delete result[key];
  return result;
};
