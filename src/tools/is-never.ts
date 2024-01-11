/**
 * Check whether `T` is `never`.
 *
 * Signature: `T -> boolean`
 */
export type IsNever<T> = [T] extends [never] ? true : false;
