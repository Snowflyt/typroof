import chalk from 'chalk';

import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a type to be `null`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(beNull); // fail
 * expect<'foo'>().not.to(beNull); // pass
 * expect<null>().to(beNull); // pass
 * ```
 */
export const beNull = match<'beNull'>();

export const registerToBeNull = () => {
  registerAnalyzer('beNull', (actual, _expected, { not }) => {
    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold('null');
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
};
