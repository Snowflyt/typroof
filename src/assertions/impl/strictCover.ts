import { bold } from '../../utils/colors';
import { match, registerAnalyzer } from '../matcher';

import type { cover } from './cover';

/**
 * [Matcher] Like {@link cover}, but fails if either type is `never` or `any`.
 * @returns
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(strictCover<'foo'>); // pass
 * expect<'foo'>().not.to(strictCover<'foo'>); // fail
 * expect<'foo'>().to(strictCover('foo')); // pass
 * expect<string>().to(strictCover<'foo'>); // pass
 * expect<'foo' | 'bar'>().to(strictCover<'foo'>); // pass
 * expect<'foo'>().to(strictCover<'bar'>); // fail
 * expect<'foo'>().to(strictCover<never>); // fail
 * expect<any>().to(strictCover<'foo'>); // fail
 * ```
 */
export const strictCover = <U>(y?: U) => match<'strictCover', U>();

export const registerToStrictCover = () => {
  registerAnalyzer('strictCover', (actual, expected, { not, typeChecker }) => {
    const actualText = bold(actual.text);
    const expectedType = bold(typeChecker.typeToString(expected));
    const actualType = bold(typeChecker.typeToString(actual.type));

    throw (
      `Expect ${actualText} (${actualType}) ${not ? 'not ' : ''}to strict cover ${expectedType}, ` +
      `but ${not ? 'it does' : 'it does not'}.`
    );
  });
};
