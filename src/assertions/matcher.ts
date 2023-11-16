import type { TyproofProject } from '../test';
import type { Diagnostic, Node, SourceFile, Type, ts } from 'ts-morph';

export const matchers = new Map<string, Matcher>();

interface Actual {
  /**
   * The text of the type. For example, if `expect<Capitalize<'foo'>>()`,
   * then `text` is `'Capitalize<'foo'>'` (not the calculated one `'Foo'`).
   */
  readonly text: string;
  /**
   * The calculated type. For example, if `expect<Capitalize<'foo'>>()`,
   * then `type` is `Type<ts.Type>` of `'Foo'`.
   */
  readonly type: Type<ts.Type>;
  /**
   * The node of the type. For example, if `expect<Capitalize<'foo'>>()`,
   * then `node` is `Node<ts.Node>` of `'Capitalize<'foo'>'`.
   */
  readonly node: Node<ts.Node>;
}

export interface MatcherMeta {
  /**
   * The typroof project.
   */
  project: TyproofProject;
  /**
   * The source file to check.
   */
  sourceFile: SourceFile;
  /**
   * Pre emit diagnostics of the source file.
   */
  diagnostics: Diagnostic<ts.Diagnostic>[];
  /**
   * Whether `expect` is called with `expect.not`.
   */
  not: boolean;
}

/**
 * A matcher function.
 */
export type Matcher = (
  /**
   * The type passed to `expect`. For example, if `expect<T>()` is called, then `actual` is `T`.
   */
  actual: Actual,
  /**
   * The type arguments passed to the matcher function. For example, if the method is `expect<T>().toExtendOneOfTwo<U, V>()`,
   * then `types` is `[U, V]`.
   */
  types: Type<ts.Type>[],
  /**
   * The return type of the matcher function.
   */
  returnType: Type<ts.Type>,
  /**
   * Meta data of the matcher function.
   */
  meta: MatcherMeta,
) => void;

/**
 * Register a matcher.
 * @param name Method name to be mixed into `expect`.
 * @param matcher The matcher function.
 *
 * @example
 * ```typescript
 * import { registerMatcher } from 'typroof';
 *
 * const toExtendOneOfTwo = 'toExtendOneOfTwo';
 *
 * type ExtendsOneOfTwo<T, U, V> = T extends U ? true : T extends V ? true : false;
 * type NotExtendsOneOfTwo<T, U, V> = T extends U ? false : T extends V ? false : true;
 *
 * // Register a matcher at type level.
 * declare module 'typroof' {
 *   interface Expect<T> {
 *     // This mixes `toExtendOneOfTwo` into `expect`, i.e. `expect(...).toExtendOneOfTwo()`.
 *     [toExtendOneOfTwo]: <U, V>() => ExtendsOneOfTwo<T, U, V>;
 *     //                              ^ You can use a specific type as the return type,
 *     //                                which can be accessed in the matcher function.
 *   }
 *
 *   // If you want to mix `toExtendOneOfTwo` into `expect.not`, you can do this:
 *   interface ExpectNot<T> {
 *     [toExtendOneOfTwo]: <U, V>() => NotExtendsOneOfTwo<T, U, V>;
 *   }
 * }
 *
 * // Register the matcher function at runtime.
 * registerMatcher(toExtendOneOfTwo, (actual, types, returnType, { not }) => {
 *   // Check whether `actual.type` extends `types[0]` or `types[1]` by the return type of the matcher function,
 *   // i.e. the `ExtendsOneOfTwo<T, U, V>` or `NotExtendsOneOfTwo<T, U, V>`.
 *   if (returnType.isLiteral() && returnType.getText() === 'true') return;
 *
 *   const actualText = chalk.bold(actual.text);
 *   const expectedType = `one of ${chalk.bold(types.map((t) => t.getText()).join(', '))}`;
 *
 *   throw `Expect ${actualText} ${not ? 'not ' : ''}to extend ${expectedType}, but `${not ? 'did' : 'did not'}`.`;
 * });
 * ```
 */
export const registerMatcher = (name: string, matcher: Matcher) => {
  matchers.set(name, matcher);
};
