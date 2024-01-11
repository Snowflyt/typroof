import chalk from 'chalk';

import { match, registerAnalyzer } from '../matcher';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { extend } from './extend';

/**
 * [Matcher] Like {@link extend}, but fails if either type is `never` or `any`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(strictExtend<'foo'>); // pass
 * expect<'foo'>().not.to(strictExtend<'foo'>); // fail
 * expect<'foo'>().to(strictExtend('foo')); // pass
 * expect<'foo'>().to(strictExtend<string>); // pass
 * expect<'foo'>().to(strictExtend<'bar'>); // fail
 * expect<'foo'>().to(strictExtend<'foo' | 'bar'>); // pass
 * expect<never>().to(strictExtend<'foo'>); // fail
 * expect<'foo'>().to(strictExtend<any>); // fail
 * ```
 */
export const strictExtend = <U>(
  // @ts-expect-error - `y` is used only for type inference
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  y?: U,
) => match<'strictExtend', U>();

export const registerToStrictExtend = () => {
  registerAnalyzer('strictExtend', (actual, expected, passed, { not }) => {
    if (passed) return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold(expected.getText());
    const actualType = chalk.bold(actual.type.getText());

    throw (
      `Expect ${actualText} (${actualType}) ${not ? 'not ' : ''}to ` +
      `strict extend ${expectedType}, ` +
      `but ${not ? 'it does' : 'it does not'}.`
    );
  });
};
