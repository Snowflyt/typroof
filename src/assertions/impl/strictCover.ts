import chalk from 'chalk';

import { match, registerAnalyzer } from '../matcher';

import type { cover } from './cover';

/**
 * [Matcher] Like {@link cover}, but fails if either type is `never` or `any`.
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
export const strictCover = <U>(
  // @ts-expect-error - `y` is used only for type inference
  y?: U,
) => match<'strictCover', U>();

export const registerToStrictCover = () => {
  registerAnalyzer('strictCover', (actual, expected, passed, { not }) => {
    if (passed) return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold(expected.getText());
    const actualType = chalk.bold(actual.type.getText());

    throw (
      `Expect ${actualText} (${actualType}) ${not ? 'not ' : ''}to strict cover ${expectedType}, ` +
      `but ${not ? 'it does' : 'it does not'}.`
    );
  });
};
