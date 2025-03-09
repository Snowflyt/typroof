import type { ToAnalyze } from '../assertions/matcher';

/**
 * A validator is a type-level function (i.e. HKT) accepting a type and returning a boolean, error
 * message (as string), or {@linkcode ToAnalyze}.
 *
 * This definition is compatible with [hkt-core](https://github.com/Snowflyt/hkt-core) V1.
 */
export interface Validator {
  /**
   * Metadata of the TypeLambda.
   */
  readonly ['~hkt']: TypeLambdaMeta;

  /**
   * type-level signature of the TypeLambda.
   */
  readonly signature: (
    actual: unknown,
    expected: unknown,
    isNegated: boolean,
  ) => boolean | string | ToAnalyze<any>;
}
/**
 * Metadata of an [hkt-core](https://github.com/Snowflyt/hkt-core) TypeLambda.
 */
interface TypeLambdaMeta {
  /**
   * The version number of the TypeLambda specification.
   */
  readonly version: 1;
}

type Args<F> =
  F extends { readonly Args: (_: infer Args extends unknown[]) => void } ? Args : never;
/**
 * Get the actual type passed to a {@linkcode Validator}.
 */
export type Actual<S extends Validator> = Args<S>[0];
/**
 * Get the expected type passed to a {@linkcode Validator}.
 */
export type Expected<S extends Validator> = Args<S>[1];
/**
 * Get the `IsNegated` flag passed to a {@linkcode Validator}.
 */
export type IsNegated<S extends Validator> = Args<S>[2];

/**
 * A serializer is a type-level function (i.e. HKT) accepting a type and returning a string.
 *
 * This definition is compatible with [hkt-core](https://github.com/Snowflyt/hkt-core) V1.
 */
export interface Serializer<T> {
  /**
   * Metadata of the TypeLambda.
   */
  readonly ['~hkt']: TypeLambdaMeta;

  /**
   * type-level signature of the TypeLambda.
   */
  readonly signature: (type: T) => string;
}

/**
 * Get the type passed to a {@linkcode Serializer}.
 */

export type Type<S extends Serializer<any>> =
  S extends { readonly Args: (_: [infer Type extends Parameters<S['signature']>[0]]) => void } ?
    Type
  : never;
