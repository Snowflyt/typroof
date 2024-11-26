import chalk from 'chalk';

import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a type to be `undefined`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(beUndefined); // fail
 * expect<'foo'>().not.to(beUndefined); // pass
 * expect<undefined>().to(beUndefined); // pass
 * ```
 */
export const beUndefined = match<'beUndefined'>();

export const registerToBeUndefined = () => {
  registerAnalyzer('beUndefined', (actual, _expected, { not }) => {
    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold('undefined');
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
};
