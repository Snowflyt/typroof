import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { registerToBeAny } from './impl/beAny';
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
  Stringify,
} from '../tools';
import type { Project } from 'ts-morph';

/**
 * Register all built-in analyzers.
 */
export const registerBuiltinAnalyzers = (() => {
  let registered = false;

  return () => {
    if (registered) return;

    registerToError();

    registerToEqual();

    registerToBeAny();
    registerToBeNever();
    registerToBeNull();
    registerToBeUndefined();
    registerToBeNullish();

    registerToMatchBoolean();
    registerToBeTrue();
    registerToBeFalse();

    registerToExtend();
    registerToStrictExtend();

    registerToCover();
    registerToStrictCover();

    registered = true;
  };
})();

/**
 * Validators for matchers.
 */
export interface Validator<T = unknown, U = unknown, Not extends boolean = boolean> {
  error: ToAnalyze;

  equal: Not extends false ?
    Equals<T, U> extends true ?
      true
    : `Expect \`${Stringify<T>}\` to equal \`${Stringify<U>}\`, but does not`
  : Equals<T, U> extends false ? false
  : `Expect the type not to equal \`${Stringify<U>}\`, but does`;

  beAny: Not extends false ?
    IsAny<T> extends true ?
      true
    : `Expect \`${Stringify<T>}\` to be \`any\`, but is not`
  : IsAny<T> extends false ? false
  : `Expect the type not to be \`any\`, but is`;
  beNever: Not extends false ?
    IsNever<T> extends true ?
      true
    : `Expect \`${Stringify<T>}\` to be \`never\`, but is not`
  : IsNever<T> extends false ? false
  : `Expect the type not to be \`never\`, but is`;
  beNull: Not extends false ?
    IsNull<T> extends true ?
      true
    : `Expect \`${Stringify<T>}\` to be \`null\`, but is not`
  : IsNull<T> extends false ? false
  : `Expect the type not to be \`null\`, but is`;
  beUndefined: Not extends false ?
    IsUndefined<T> extends true ?
      true
    : `Expect \`${Stringify<T>}\` to be \`undefined\`, but is not`
  : IsUndefined<T> extends false ? false
  : `Expect the type not to be \`undefined\`, but is`;
  beNullish: Not extends false ?
    IsNullish<T> extends true ?
      true
    : `Expect \`${Stringify<T>}\` to be \`null\`, \`undefined\` or \`null | undefined\`, but is not`
  : IsNullish<T> extends false ? false
  : `Expect the type not to be \`null\`, \`undefined\` or \`null | undefined\`, but is`;

  matchBoolean: Not extends false ?
    MatchesBoolean<T> extends true ?
      true
    : `Expect \`${Stringify<T>}\` to be boolean, but is not`
  : MatchesBoolean<T> extends false ? false
  : `Expect the type not to be boolean, but is`;
  beTrue: Not extends false ?
    IsTrue<T> extends true ?
      true
    : `Expect \`${Stringify<T>}\` to be \`true\`, but is not`
  : IsTrue<T> extends false ? false
  : `Expect the type not to be \`true\`, but is`;
  beFalse: Not extends false ?
    IsFalse<T> extends true ?
      true
    : `Expect \`${Stringify<T>}\` to be \`false\`, but is not`
  : IsFalse<T> extends false ? false
  : `Expect the type not to be \`false\`, but is`;

  extend: Not extends false ?
    Extends<T, U> extends true ?
      true
    : `Expect \`${Stringify<T>}\` to extend \`${Stringify<U>}\`, but does not`
  : Extends<T, U> extends false ? false
  : `Expect \`${Stringify<T>}\` not to extend \`${Stringify<U>}\`, but does`;
  strictExtend: Not extends false ?
    StrictExtends<T, U> extends true ?
      true
    : `Expect \`${Stringify<T>}\` to strictly extend \`${Stringify<U>}\`, but does not`
  : StrictExtends<T, U> extends false ? false
  : `Expect \`${Stringify<T>}\` not to strictly extend \`${Stringify<U>}\`, but does`;

  cover: Not extends false ?
    Covers<T, U> extends true ?
      true
    : `Expect \`${Stringify<T>}\` to cover \`${Stringify<U>}\`, but does not`
  : Covers<T, U> extends false ? false
  : `Expect \`${Stringify<T>}\` not to cover \`${Stringify<U>}\`, but does`;
  strictCover: Not extends false ?
    StrictCovers<T, U> extends true ?
      true
    : `Expect \`${Stringify<T>}\` to strictly cover \`${Stringify<U>}\`, but does not`
  : StrictCovers<T, U> extends false ? false
  : `Expect \`${Stringify<T>}\` not to strictly cover \`${Stringify<U>}\`, but does`;
}

export interface Expect<T> {
  to: <Tag extends keyof Validator<unknown, unknown, false>, U>(
    match: [Validator<T, U, false>[Tag]] extends [never] ?
      `Validation failed: ${Tag}<${Stringify<T>}, ${Stringify<U>}>`
    : Validator<T, U, false>[Tag] extends true | ToAnalyze<unknown> ?
      (() => Match<Tag, U>) | Match<Tag, U>
    : Validator<T, U, false>[Tag] extends string ? Validator<T, U, false>[Tag]
    : `Validation failed: ${Tag}<${Stringify<T>}, ${Stringify<U>}>`,
  ) => [Validator<T, U, false>[Tag]] extends [never] ? 'fail'
  : Validator<T, U, false>[Tag] extends true ? 'pass'
  : Validator<T, U, false>[Tag] extends ToAnalyze<unknown> ? Validator<T, U, false>[Tag]
  : 'fail';
  not: {
    to: <Tag extends keyof Validator<unknown, unknown, true>, U>(
      match: [Validator<T, U, true>[Tag]] extends [never] ? 'fail'
      : Validator<T, U, true>[Tag] extends false | ToAnalyze<unknown> ?
        (() => Match<Tag, U>) | Match<Tag, U>
      : Validator<T, U, true>[Tag] extends string ? Validator<T, U, true>[Tag]
      : `Validation failed: not ${Tag}<${Stringify<T>}, ${Stringify<U>}>`,
    ) => [Validator<T, U, true>[Tag]] extends [never] ? 'fail'
    : Validator<T, U, true>[Tag] extends false ? 'pass'
    : Validator<T, U, true>[Tag] extends ToAnalyze<unknown> ? Validator<T, U, false>[Tag]
    : 'fail';
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
    result = __filename;
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
