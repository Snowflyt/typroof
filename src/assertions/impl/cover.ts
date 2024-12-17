import { bold } from '../../utils/colors';
import { match, registerAnalyzer } from '../matcher';

import type { strictCover } from './strictCover';

/**
 * [Matcher] Expect the given type to be assignable to the type (i.e. the given type should be a
 * subtype of the type).
 *
 * **Warning:** In TypeScript, `any` is both a subtype and a supertype of all other types.
 * Therefore, `expect<string>().to(cover<any>)` and `expect<any>().to(cover<string>)` will both pass.
 * The exception is `never`, which is not assignable to any type (thus `expect<never>().to(cover<any>)` fails).
 * Keep this in mind, as it may lead to unexpected results when working with `any` or `never`.
 * Use {@link strictCover} for a stricter version that fails if either the type or the given type is `never` or `any`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(cover<'foo'>); // pass
 * expect<'foo'>().not.to(cover<'foo'>); // fail
 * expect<'foo'>().to(cover('foo')); // pass
 * expect<string>().to(cover<'foo'>); // pass
 * expect<'foo' | 'bar'>().to(cover<'foo'>); // pass
 * expect<'foo'>().to(cover<'bar'>); // fail
 * expect<'foo'>().to(cover<never>); // pass
 * expect<any>().to(cover<'foo'>); // pass
 * ```
 */
export const cover = <U>(
  // @ts-expect-error - `y` is used only for type inference

  y?: U,
) => match<'cover', U>();

export const registerToCover = () => {
  registerAnalyzer('cover', (actual, expected, { not }) => {
    const actualText = bold(actual.text);
    const expectedType = bold(expected.getText());
    const actualType = bold(actual.type.getText());

    throw (
      `Expect ${actualText} (${actualType}) ${not ? 'not ' : ''}to cover ${expectedType}, ` +
      `but ${not ? 'it does' : 'it does not'}.`
    );
  });
};
