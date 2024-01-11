import type { IsAny } from './is-any';
import type { IsNever } from './is-never';

/**
 * Check whether `U` is assignable to `T`.
 *
 * Signature: `(T, U) -> boolean`
 *
 * **Warning:** In TypeScript, `any` is both a subtype and a supertype of all other types.
 * Therefore, `Covers<string, any>` and `Covers<any, string>` will both evaluate to `true`.
 * The exception is `never`, which is not assignable to any type (thus `Covers<never, any>` is `false`).
 * Keep this in mind, as it may lead to unexpected results when working with `any` or `never`.
 * Use {@link StrictCovers} for a stricter version that evaluates to `false` if either `T` or `U` is `never` or `any`.
 */
export type Covers<T, U> = ((_: [T]) => void) extends (_: [U]) => void ? true : false;

/**
 * Like {@link Covers} but fails if either `T` or `U` is `never` or `any`.
 *
 * Signature: `(T, U) -> boolean`
 */
export type StrictCovers<T, U> = IsNever<T> extends true
  ? false
  : IsNever<U> extends true
  ? false
  : IsAny<T> extends true
  ? false
  : IsAny<U> extends true
  ? false
  : Covers<T, U>;
