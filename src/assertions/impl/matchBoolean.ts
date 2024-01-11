import chalk from 'chalk';

import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a type to be `true`, `false`, or `boolean`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(matchBoolean); // fail
 * expect<'foo'>().not.to(matchBoolean); // pass
 * expect<true>().to(matchBoolean); // pass
 * expect<false>().to(matchBoolean); // pass
 * expect<boolean>().to(matchBoolean); // pass
 * ```
 *
 * @since 0.1.2
 */
export const matchBoolean = match<'matchBoolean'>();

export const registerToMatchBoolean = () => {
  registerAnalyzer('matchBoolean', (actual, _, passed, { not }) => {
    if (passed) return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold('true, false or boolean');
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
};
