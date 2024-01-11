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
