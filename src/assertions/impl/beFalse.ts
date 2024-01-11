import chalk from 'chalk';

import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a type to be `false`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(beFalse); // fail
 * expect<'foo'>().not.to(beFalse); // pass
 * expect<true>().to(beFalse); // fail
 * expect<false>().to(beFalse); // pass
 * expect<boolean>().to(beFalse); // fail
 * ```
 *
 * @since 0.1.1
 */
export const beFalse = match<'beFalse'>();

export const registerToBeFalse = () => {
  registerAnalyzer('beFalse', (actual, _, passed, { not }) => {
    if (passed) return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold('false');
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
};
