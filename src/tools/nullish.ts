import type { Equals } from './equals';

/**
 * Check whether `T` is `unknown`.
 *
 * Signature: `T -> boolean`
 */
export type IsUndefined<T> = Equals<T, undefined>;

/**
 * Check whether `T` is `null`.
 *
 * Signature: `T -> boolean`
 */
export type IsNull<T> = Equals<T, null>;

/**
 * Check whether `T` is `null`, `undefined`, or `null | undefined`.
 *
 * Signature: `T -> boolean`
 */
export type IsNullish<T> = IsUndefined<T> extends true
  ? true
  : IsNull<T> extends true
  ? true
  : Equals<T, null | undefined>;
