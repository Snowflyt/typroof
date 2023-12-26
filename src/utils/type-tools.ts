export type Not<T extends boolean> = T extends true ? false : true;

export type Equals<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
  ? true
  : false;

export type IsNever<T> = [T] extends [never] ? true : false;
export type IsAny<T> = 0 extends 1 & T ? true : false;
export type IsUndefined<T> = Equals<T, undefined>;
export type IsNull<T> = Equals<T, null>;
export type IsNullish<T> = IsUndefined<T> extends true
  ? true
  : IsNull<T> extends true
  ? true
  : Equals<T, null | undefined>;

export type MatchesBoolean<T> = IsNever<T> extends true ? false : T extends boolean ? true : false;
export type IsTrue<T> = Equals<T, true>;
export type IsFalse<T> = Equals<T, false>;

/**
 * Check if `T` is a subtype of `U`.
 *
 * **Warning:** `any` is considered both subtype and supertype of all types in TypeScript, so
 * both `Extends<string, any>` and `Extends<any, string>` will return `true` (`string` can be
 * replaced with any other type, including `any`), so keep that in mind when using this. If you
 * want to check if `T` is a subtype of `U` but not `any`, use {@link StrictExtends} instead.
 */
export type Extends<T, U> = (() => [T]) extends () => [U] ? true : false;
/**
 * {@link Extends} but fails if either `T` or `U` is `never` or `any`.
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
 * Check if `T` is a supertype of `U`.
 *
 * **Warning:** `any` is considered both subtype and supertype of all types in TypeScript, so
 * both `Covers<string, any>` and `Covers<any, string>` will return `true` (`string` can be
 * replaced with any other type, including `any`), so keep that in mind when using this. If you
 * want to check if `T` is a supertype of `U` but not `any`, use {@link StrictCovers} instead.
 */
export type Covers<T, U> = ((_: [T]) => void) extends (_: [U]) => void ? true : false;
/**
 * {@link Covers} but fails if either `T` or `U` is `never` or `any`.
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
