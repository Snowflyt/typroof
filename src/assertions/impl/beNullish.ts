import chalk from 'chalk';

import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a type to be `null` or `undefined`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(beNullish); // fail
 * expect<'foo'>().not.to(beNullish); // pass
 * expect<null>().to(beNullish); // pass
 * expect<undefined>().to(beNullish); // pass
 * ```
 */
export const beNullish = match<'beNullish'>();

export const registerToBeNullish = () => {
  registerAnalyzer('beNullish', (actual, _expected, { not }) => {
    const actualText = chalk.bold(actual.text);
    const expectedType =
      chalk.bold('null') + ', ' + chalk.bold('undefined') + ' or ' + chalk.bold('null | undefined');
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
};
