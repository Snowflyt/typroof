import chalk from 'chalk';

import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a type to be equal to the given type.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(equal<'foo'>); // pass
 * expect<'foo'>().not.to(equal<'foo'>); // fail
 * expect<'foo'>().to(equal('foo')); // pass
 * expect<'foo'>().to(equal<'bar'>); // fail
 * expect<'foo'>().to(equal<'foo' | 'bar'>); // fail
 * ```
 */
export const equal = <U>(
  // @ts-expect-error - `y` is used only for type inference
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  y?: U,
) => match<'equal', U>();

export const registerToEqual = () => {
  registerAnalyzer('equal', (actual, expected, passed, { not }) => {
    if (passed) return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold(expected.getText());
    const actualType = chalk.bold(actual.type.getText());

    throw (
      `Expect ${actualText} ${not ? 'not ' : ''}to equal ${expectedType}, ` +
      `but got ${actualType}.`
    );
  });
};
