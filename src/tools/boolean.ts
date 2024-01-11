import type { Equals } from './equals';
import type { IsNever } from './is-never';

/**
 * Check whether `T` is `true`, `false`, or `boolean`.
 *
 * Signature: `T -> boolean`
 */
export type MatchesBoolean<T> = IsNever<T> extends true ? false : T extends boolean ? true : false;

/**
 * Check whether `T` is `true`.
 *
 * Signature: `T -> boolean`
 */
export type IsTrue<T> = Equals<T, true>;

/**
 * Check whether `T` is `false`.
 *
 * Signature: `T -> boolean`
 */
export type IsFalse<T> = Equals<T, false>;
