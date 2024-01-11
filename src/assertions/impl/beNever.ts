import chalk from 'chalk';

import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a type to be `never`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(beNever); // fail
 * expect<'foo'>().not.to(beNever); // pass
 * expect<never>().to(beNever); // pass
 * ```
 */
export const beNever = match<'beNever'>();

export const registerToBeNever = () => {
  registerAnalyzer('beNever', (actual, _, passed, { not }) => {
    if (passed) return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold('never');
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
};
