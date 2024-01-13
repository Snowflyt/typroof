import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { registerToBeFalse } from './impl/beFalse';
import { registerToBeNever } from './impl/beNever';
import { registerToBeNull } from './impl/beNull';
import { registerToBeNullish } from './impl/beNullish';
import { registerToBeTrue } from './impl/beTrue';
import { registerToBeUndefined } from './impl/beUndefined';
import { registerToCover } from './impl/cover';
import { registerToEqual } from './impl/equal';
import { registerToError } from './impl/error';
import { registerToExtend } from './impl/extend';
import { registerToMatchBoolean } from './impl/matchBoolean';
import { registerToStrictCover } from './impl/strictCover';
import { registerToStrictExtend } from './impl/strictExtend';

import type { Match, ToAnalyze } from './matcher';
import type {
  Covers,
  Equals,
  Extends,
  IsAny,
  IsFalse,
  IsNever,
  IsNull,
  IsNullish,
  IsTrue,
  IsUndefined,
  MatchesBoolean,
  StrictCovers,
  StrictExtends,
} from '@/tools';
import type { Project } from 'ts-morph';

/**
 * Register all built-in analyzers.
 */
export const registerBuiltinAnalyzers = (() => {
  let registered = false;

  return () => {
    if (registered) return;

    registerToEqual();
    registerToCover();
    registerToBeNever();
    registerToBeNull();
    registerToBeNullish();
    registerToBeUndefined();
    registerToMatchBoolean();
    registerToBeTrue();
    registerToBeFalse();
    registerToExtend();
    registerToStrictExtend();
    registerToCover();
    registerToStrictCover();
    registerToError();

    registered = true;
  };
})();

/**
 * Validators for matchers.
 */
export interface Validator<T = unknown, U = unknown> {
  error: ToAnalyze;

  equal: Equals<T, U>;

  beAny: IsAny<T>;
  beNever: IsNever<T>;
  beNull: IsNull<T>;
  beUndefined: IsUndefined<T>;
  beNullish: IsNullish<T>;

  matchBoolean: MatchesBoolean<T>;
  beTrue: IsTrue<T>;
  beFalse: IsFalse<T>;

  extend: Extends<T, U>;
  strictExtend: StrictExtends<T, U>;

  cover: Covers<T, U>;
  strictCover: StrictCovers<T, U>;
}

export interface Expect<T> {
  to: {
    (match: never): 'fail';
    <Tag extends keyof Validator<unknown, unknown>, U>(
      match: Validator<T, U>[Tag] extends true ? () => Match<Tag, U> : never,
    ): 'pass';
    <Tag extends keyof Validator<unknown, unknown>, U>(
      match: Validator<T, U>[Tag] extends true ? Match<Tag, U> : never,
    ): 'pass';
    <Tag extends keyof Validator<unknown, unknown>, U>(
      match: Validator<T, U>[Tag] extends ToAnalyze<unknown> ? Match<Tag, U> : never,
    ): Validator<T, U>[Tag];
  };
  not: {
    to: {
      (match: never): 'fail';
      <Tag extends keyof Validator<unknown, unknown>, U>(
        match: Validator<T, U>[Tag] extends false ? () => Match<Tag, U> : never,
      ): 'pass';
      <Tag extends keyof Validator<unknown, unknown>, U>(
        match: Validator<T, U>[Tag] extends false ? Match<Tag, U> : never,
      ): 'pass';
      <Tag extends keyof Validator<unknown, unknown>, U>(
        match: Validator<T, U>[Tag] extends ToAnalyze<unknown> ? Match<Tag, U> : never,
      ): Validator<T, U>[Tag];
    };
  };
}

/**
 * Expect a type to satisfy a set of assertions.
 *
 * @example
 * ```typescript
 * import { expect } from 'typroof';
 *
 * expect<'foo'>().to(equal<'foo'>); // pass
 * expect<'foo'>().to(equal('foo')); // pass
 * expect<'foo'>().to(extend<number>); // fail
 * expect<'foo'>().not.to(extend<number>); // pass
 * ```
 */
export const expect: <T>(t?: T) => Expect<T> = () => ({
  to: (() => {}) as never,
  not: { to: (() => {}) as never },
});

const currentFilePathName = (() => {
  let result = '';
  try {
    result = __dirname;
  } catch (error) {
    result = fileURLToPath(import.meta.url);
  }
  if (path.extname(result) === '.js')
    result = path.join(path.dirname(result), path.basename(result, '.js') + '.d.ts');
  return result;
})();
export const getExpectSymbol = (project: Project) => {
  const file = project.addSourceFileAtPath(currentFilePathName);
  const symbol = file.getExportedDeclarations().get('expect')?.[0]?.getSymbol();
  if (!symbol) throw new Error('Cannot find `expect` symbol');
  return symbol;
};
