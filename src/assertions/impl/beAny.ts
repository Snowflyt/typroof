import chalk from 'chalk';

import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a type to be `any`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(beAny); // fail
 * expect<'foo'>().not.to(beAny); // pass
 * expect<any>().to(beAny); // pass
 * ```
 */
export const beAny = match<'beAny'>();

export const registerToBeAny = () => {
  registerAnalyzer('beAny', (actual, _, passed, { not }) => {
    if (passed) return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold('any');
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
};
