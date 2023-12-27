/**
 * Invert boolean type `B`.
 *
 * Signature: `(B : boolean) -> boolean`
 *
 * @example
 * ```typescript
 * type R1 = Not<true>;
 * //   ^?: false
 * type R2 = Not<false>;
 * //   ^?: true
 * type R3 = Not<boolean>;
 * //   ^?: boolean
 * type R4 = Not<true | false>;
 * //   ^?: boolean
 * type R5 = Not<never>;
 * //   ^?: never
 * type R6 = Not<any>;
 * //   ^?: boolean
 * ```
 */
export type Not<B extends boolean> = B extends true ? false : true;

/**
 * Check whether `T` is equal to `U`.
 *
 * Signature: `(T, U) -> boolean`
 */
export type Equals<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
  ? true
  : false;

/**
 * Check whether `T` is `never`.
 *
 * Signature: `T -> boolean`
 */
export type IsNever<T> = [T] extends [never] ? true : false;
/**
 * Check whether `T` is `any`.
 *
 * Signature: `T -> boolean`
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;
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
export type Extends<T, U> = (() => [T]) extends () => [U] ? true : false;
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
