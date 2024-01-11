/**
 * Check whether `T` is `any`.
 *
 * Signature: `T -> boolean`
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;
