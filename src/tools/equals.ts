/**
 * Check whether `T` is equal to `U`.
 *
 * Signature: `(T, U) -> boolean`
 */
export type Equals<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
  ? true
  : false;
