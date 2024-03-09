import type { Analyzer, Match, Validator } from './assertions';

export interface Plugin {
  name: string;
  analyzers: { readonly [P in keyof Validator<unknown, unknown>]?: Analyzer<P> };
}

/**
 * Used to create a matcher.
 * @returns
 *
 * @example
 * ```typescript
 * export const beFoo = match<'beFoo'>();
 * export const equal = <U>(y?: U) => match<'equal', U>();
 * ```
 */
// It is also defined in `./assertions/matcher.ts` to avoid circular dependency.
export const match = <Tag extends keyof Validator<unknown, unknown>, T = never>() =>
  ({} as Match<Tag, T>);

export type { Match };
export type { Analyzer, AnalyzerMeta, ToAnalyze } from './assertions';
