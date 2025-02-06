import type { Validator } from './assertions/assert';
import type { Analyzer, Match } from './assertions/matcher';

export interface Plugin {
  name: string;
  analyzers: { readonly [P in keyof Validator<unknown, unknown>]?: Analyzer };
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
  ({}) as Match<Tag, T>;

export type { Validator } from './assertions/assert';
export type { Analyzer, AnalyzerMeta, Match, ToAnalyze } from './assertions/matcher';

export type {
  Stringify,
  StringifyOptions,
  StringifyOptionsDefault,
  StringifySerializer,
} from './tools';
