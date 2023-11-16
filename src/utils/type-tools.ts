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

export type Extends<T, U> = (() => [T]) extends () => [U] ? true : false;
/**
 * `Extends` but exclude `never` and `any` from `T` and `U`.
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

export type Covers<T, U> = ((_: [T]) => void) extends (_: [U]) => void ? true : false;
/**
 * `Covers` but exclude `never` and `any` from `T` and `U`.
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
