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
import type { Actual, Expected, IsNegated, Validator } from '../tools/HKT';
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
export interface ValidatorRegistry {
  error: ErrorValidator;

  equal: EqualValidator;

  beAny: BeAnyValidator;
  beNever: BeNeverValidator;
  beNull: BeNullValidator;
  beUndefined: BeUndefinedValidator;
  beNullish: BeNullishValidator;

  matchBoolean: MatchBooleanValidator;
  beTrue: BeTrueValidator;
  beFalse: BeFalseValidator;

  extend: ExtendValidator;
  strictExtend: StrictExtendValidator;

  cover: CoverValidator;
  strictCover: StrictCoverValidator;
}

/* Validators start */
interface ErrorValidator extends Validator {
  return: ToAnalyze;
}

interface EqualValidator extends Validator {
  return: IsNegated<this> extends false ?
    Equals<Actual<this>, Expected<this>> extends true ?
      true
    : `Expect \`${Stringify<Actual<this>>}\` to equal \`${Stringify<Expected<this>>}\`, but does not`
  : Equals<Actual<this>, Expected<this>> extends false ? false
  : `Expect the type not to equal \`${Stringify<Expected<this>>}\`, but does`;
}

interface BeAnyValidator extends Validator {
  return: IsNegated<this> extends false ?
    IsAny<Actual<this>> extends true ?
      true
    : `Expect \`${Stringify<Actual<this>>}\` to be \`any\`, but is not`
  : IsAny<Actual<this>> extends false ? false
  : `Expect the type not to be \`any\`, but is`;
}
interface BeNeverValidator extends Validator {
  return: IsNegated<this> extends false ?
    IsNever<Actual<this>> extends true ?
      true
    : `Expect \`${Stringify<Actual<this>>}\` to be \`never\`, but is not`
  : IsNever<Actual<this>> extends false ? false
  : `Expect the type not to be \`never\`, but is`;
}
interface BeNullValidator extends Validator {
  return: IsNegated<this> extends false ?
    IsNull<Actual<this>> extends true ?
      true
    : `Expect \`${Stringify<Actual<this>>}\` to be \`null\`, but is not`
  : IsNull<Actual<this>> extends false ? false
  : `Expect the type not to be \`null\`, but is`;
}
interface BeUndefinedValidator extends Validator {
  return: IsNegated<this> extends false ?
    IsUndefined<Actual<this>> extends true ?
      true
    : `Expect \`${Stringify<Actual<this>>}\` to be \`undefined\`, but is not`
  : IsUndefined<Actual<this>> extends false ? false
  : `Expect the type not to be \`undefined\`, but is`;
}
interface BeNullishValidator extends Validator {
  return: IsNegated<this> extends false ?
    IsNullish<Actual<this>> extends true ?
      true
    : `Expect \`${Stringify<Actual<this>>}\` to be \`null\`, \`undefined\` or \`null | undefined\`, but is not`
  : IsNullish<Actual<this>> extends false ? false
  : `Expect the type not to be \`null\`, \`undefined\` or \`null | undefined\`, but is`;
}

interface MatchBooleanValidator extends Validator {
  return: IsNegated<this> extends false ?
    MatchesBoolean<Actual<this>> extends true ?
      true
    : `Expect \`${Stringify<Actual<this>>}\` to be \`boolean\`, \`true\` or \`false\`, but is not`
  : MatchesBoolean<Actual<this>> extends false ? false
  : `Expect the type not to be \`boolean\`, \`true\` or \`false\`, but is`;
}
interface BeTrueValidator extends Validator {
  return: IsNegated<this> extends false ?
    IsTrue<Actual<this>> extends true ?
      true
    : `Expect \`${Stringify<Actual<this>>}\` to be \`true\`, but is not`
  : IsTrue<Actual<this>> extends false ? false
  : `Expect the type not to be \`true\`, but is`;
}
interface BeFalseValidator extends Validator {
  return: IsNegated<this> extends false ?
    IsFalse<Actual<this>> extends true ?
      true
    : `Expect \`${Stringify<Actual<this>>}\` to be \`false\`, but is not`
  : IsFalse<Actual<this>> extends false ? false
  : `Expect the type not to be \`false\`, but is`;
}

interface ExtendValidator extends Validator {
  return: IsNegated<this> extends false ?
    Extends<Actual<this>, Expected<this>> extends true ?
      true
    : `Expect \`${Stringify<Actual<this>>}\` to extend \`${Stringify<Expected<this>>}\`, but does not`
  : Extends<Actual<this>, Expected<this>> extends false ? false
  : `Expect \`${Stringify<Actual<this>>}\` not to extend \`${Stringify<Expected<this>>}\`, but does`;
}
interface StrictExtendValidator extends Validator {
  return: IsNegated<this> extends false ?
    StrictExtends<Actual<this>, Expected<this>> extends true ?
      true
    : `Expect \`${Stringify<Actual<this>>}\` to strictly extend \`${Stringify<Expected<this>>}\`, but does not`
  : StrictExtends<Actual<this>, Expected<this>> extends false ? false
  : `Expect \`${Stringify<Actual<this>>}\` not to strictly extend \`${Stringify<Expected<this>>}\`, but does`;
}

interface CoverValidator extends Validator {
  return: IsNegated<this> extends false ?
    Covers<Actual<this>, Expected<this>> extends true ?
      true
    : `Expect \`${Stringify<Actual<this>>}\` to cover \`${Stringify<Expected<this>>}\`, but does not`
  : Covers<Actual<this>, Expected<this>> extends false ? false
  : `Expect \`${Stringify<Actual<this>>}\` not to cover \`${Stringify<Expected<this>>}\`, but does`;
}
interface StrictCoverValidator extends Validator {
  return: IsNegated<this> extends false ?
    StrictCovers<Actual<this>, Expected<this>> extends true ?
      true
    : `Expect \`${Stringify<Actual<this>>}\` to strictly cover \`${Stringify<Expected<this>>}\`, but does not`
  : StrictCovers<Actual<this>, Expected<this>> extends false ? false
  : `Expect \`${Stringify<Actual<this>>}\` not to strictly cover \`${Stringify<Expected<this>>}\`, but does`;
}
/* Validators end */

type CallValidator<V extends Validator, Actual, Expected, IsNegated extends boolean> =
  V & { readonly Args: (_: [Actual, Expected, IsNegated]) => void } extends (
    { readonly return: infer R }
  ) ?
    R
  : never;

/**
 * An interface to provide readable compile-time error messages.
 */
interface ValidationError<Tag, Actual, Expected> {
  tag: Tag;
  actual: Actual;
  expected: Expected;
}
/**
 * An interface to provide readable compile-time error messages.
 */
interface NotTo<Tag extends string> {
  not: Tag;
}

export interface Expect<T> {
  to: <Tag extends keyof ValidatorRegistry, U>(
    match: [CallValidator<ValidatorRegistry[Tag], T, U, false>] extends [never] ?
      ValidationError<Tag, T, U>
    : CallValidator<ValidatorRegistry[Tag], T, U, false> extends true | ToAnalyze<unknown> ?
      (() => Match<Tag, U>) | Match<Tag, U>
    : CallValidator<ValidatorRegistry[Tag], T, U, false> extends string ?
      CallValidator<ValidatorRegistry[Tag], T, U, false>
    : ValidationError<Tag, T, U>,
  ) => [CallValidator<ValidatorRegistry[Tag], T, U, false>] extends [never] ? 'fail'
  : CallValidator<ValidatorRegistry[Tag], T, U, false> extends true ? 'pass'
  : CallValidator<ValidatorRegistry[Tag], T, U, false> extends ToAnalyze<unknown> ?
    CallValidator<ValidatorRegistry[Tag], T, U, false>
  : 'fail';
  not: {
    to: <Tag extends keyof ValidatorRegistry, U>(
      match: [CallValidator<ValidatorRegistry[Tag], T, U, true>] extends [never] ?
        ValidationError<NotTo<Tag>, T, U>
      : CallValidator<ValidatorRegistry[Tag], T, U, true> extends false | ToAnalyze<unknown> ?
        (() => Match<Tag, U>) | Match<Tag, U>
      : CallValidator<ValidatorRegistry[Tag], T, U, true> extends string ?
        CallValidator<ValidatorRegistry[Tag], T, U, true>
      : ValidationError<NotTo<Tag>, T, U>,
    ) => [CallValidator<ValidatorRegistry[Tag], T, U, true>] extends [never] ? 'fail'
    : CallValidator<ValidatorRegistry[Tag], T, U, true> extends false ? 'pass'
    : CallValidator<ValidatorRegistry[Tag], T, U, true> extends ToAnalyze<unknown> ?
      CallValidator<ValidatorRegistry[Tag], T, U, true>
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
