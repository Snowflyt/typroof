import type * as ts from 'typescript';

import type { TyproofProject } from '../runtime';

import type { ValidatorRegistry } from './assert';

export interface ToAnalyze<T = never> {
  'typroof/ToAnalyze': T;
}

export interface Match<Tag extends keyof ValidatorRegistry, T = never> {
  'typroof/Match': Tag;
  type: T;
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
export const match = <Tag extends keyof ValidatorRegistry, T = never>() => ({}) as Match<Tag, T>;

export const analyzers = new Map<string, Analyzer>();

interface Actual {
  /**
   * The text of the type. For example, if `expect<Capitalize<'foo'>>()`,
   * then `text` is `'Capitalize<'foo'>'` (not the calculated one `'Foo'`).
   */
  readonly text: string;
  /**
   * The calculated type. For example, if `expect<Capitalize<'foo'>>()`,
   * then `type` is `ts.Type` of `'Foo'`.
   */
  readonly type: ts.Type;
  /**
   * The node of the type. For example, if `expect<Capitalize<'foo'>>()`,
   * then `node` is `ts.Node` of `'Capitalize<'foo'>'`.
   */
  readonly node: ts.Node;
}

export interface AnalyzerMeta {
  /**
   * The return type of the validator.
   */
  validationResult?: ts.Type;

  /**
   * The typroof project.
   */
  project: TyproofProject;
  /**
   * The TypeScript program of the project.
   */
  program: ts.Program;
  /**
   * The type checker of the project.
   */
  typeChecker: ts.TypeChecker;
  /**
   * The source file to check.
   */
  sourceFile: ts.SourceFile;
  /**
   * Pre emit diagnostics of the source file.
   */
  diagnostics: readonly ts.Diagnostic[];
  /**
   * Whether `expect` is called with `expect.not`.
   */
  not: boolean;
  /**
   * The statement of the assertion.
   */
  statement: ts.CallExpression;
}

/**
 * An analyzer function.
 */
export type Analyzer = (
  /**
   * The type passed to `expect`. For example, if `expect<T>()` is called, then `actual` is `T`.
   */
  actual: Actual,
  /**
   * The type argument passed to the matcher. For example, if the method is
   * `expect<T>().to(equal<U>)`, then `expectedType` is `U`.
   */
  expectedType: ts.Type,
  /**
   * Meta data of the analyzer function.
   */
  meta: AnalyzerMeta,
) => void;

/**
 * Register an analyzer.
 * @param tag The matcher tag.
 * @param analyzer The analyzer function.
 * @private
 *
 * @example
 * ```typescript
 * import { match } from 'typroof/plugin';
 * import type { Actual, Expected, Validator } from 'typroof/plugin';
 *
 * // `equal` is a matcher that takes a type argument.
 * // If no argument is needed, you can simply use `match<'matcherName'>()`
 * // instead of a function.
 * export const equal = <U>(y?: U) => match<'equal', U>();
 *
 * // Check whether `T` is equal to `U`.
 * // It is a utility type used in the type level validation step.
 * type Equals<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
 *   ? true
 *   : false;
 *
 * // Define how the type level validation step works.
 * // If type level validation is the only thing you need to do (e.g., `equal`),
 * // it should be a `Validator` returning a boolean type.
 * // Otherwise, it should return a `ToAnalyze<SomeType>`, e.g. `error` returns
 * // `ToAnalyze<never>`, the `ToAnalyze` means to determine whether the assertion
 * // passed or not needs further code analysis. You can pass any type to
 * // `ToAnalyze` for the code analysis step to use, but here `error` does not need it.
 * declare module 'typroof/plugin' {
 *   interface ValidatorRegistry {
 *     // Here `equal` is the name of the matcher,
 *     // it must be the same as that in `match<'equal'>()`.
 *     equal: EqualValidator;
 *   }
 * }
 * // Use a type-level function (i.e. HKT, see [hkt-core](https://github.com/Snowflyt/hkt-core)) to
 * // define a type-level validator.
 * interface EqualValidator extends Validator {
 *   return: Equals<Actual<this>, Expected<this>>;
 * }
 *
 * // The `registerToEqual` function is called somewhere before code analysis is executed.
 * // If you need to define custom matchers, you should call the corresponding `registerTo...`
 * // function first — The `typroof.config.ts` file is a good place to do this.
 * export const registerToEqual = () => {
 *   // If it is a type level only matcher (i.e. The related validator returns a boolean type),
 *   // the third argument is a boolean indicating whether the validation step is passed.
 *   // Otherwise (i.e. The related validator returns a `ToAnalyze<SomeType>`), the third
 *   // argument is a `ts.Type` object representing the type to analyze, e.g., `error` returns
 *   // `ToAnalyze<never>`, so the third argument is a `Type` object representing `never`.
 *   registerAnalyzer('equal', (actual, expected, passed, { not, typeChecker }) => {
 *     if (passed) return;
 *
 *     // Here `equal` is a type level only assertion, so we just need to report the error.
 *     // But you can do anything you want here, e.g., `error` checks if the type emits an
 *     // error. The fourth argument provides necessary metadata for you to achieve almost
 *     // anything you can via TypeScript compiler API.
 *
 *     const actualText = `\x1b[1m${actual.text}\x1b[22m`; // Bold the text with ANSI escape codes
 *     const expectedType = `\x1b[1m${typeChecker.typeToString(expected)}\x1b[22m`;
 *     const actualType = `\x1b[1m{typeChecker.typeToString(actual.type)}\x1b[22m`;
 *
 *     // Throw a string to report the error.
 *     throw (
 *       `Expect ${actualText} ${not ? 'not ' : ''}to equal ${expectedType}, ` +
 *       `but got ${actualType}.`
 *     );
 *   });
 * };
 * ```
 */
export const registerAnalyzer = <Tag extends keyof ValidatorRegistry>(
  tag: Tag,
  analyzer: Analyzer,
) => {
  if (analyzers.has(tag)) throw new Error(`Analyzer for '${tag}' is already registered.`);

  analyzers.set(tag, analyzer);
};
