import type { IsAny } from './is-any';
import type { IsNever } from './is-never';

/**
 * Check whether `T` is assignable to `U`.
 *
 * Signature: `(T, U) -> boolean`
 *
 * **Warning:** In TypeScript, `any` is both a subtype and a supertype of all other types.
 * Therefore, `Extends<string, any>` and `Extends<any, string>` will both evaluate to `true`.
 * The exception is `never`, which is not assignable to any type (thus `Extends<any, never>` is `false`).
 * Keep this in mind, as it may lead to unexpected results when working with `any` or `never`.
 * Use {@link StrictExtends} for a stricter version that evaluates to `false` if either `T` or `U` is `never` or `any`.
 */
export type Extends<T, U> = [T] extends [U] ? true : false;

/**
 * Like {@link Extends} but fails if either `T` or `U` is `never` or `any`.
 *
 * Signature: `(T, U) -> boolean`
 */
export type StrictExtends<T, U> = IsNever<T> extends true
  ? false
  : IsNever<U> extends true
  ? false
  : IsAny<T> extends true
  ? false
  : IsAny<U> extends true
  ? false
  : Extends<T, U>;
