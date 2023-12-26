import chalk from 'chalk';

import { registerMatcher } from '../matcher';

import type { MatchesBoolean, Not } from '../../utils/type-tools';
import type { Matcher } from '../matcher';

export const toMatchBoolean = 'toMatchBoolean';

export type ToMatchBoolean<T> = () => MatchesBoolean<T>;
export type NotToMatchBoolean<T> = () => Not<MatchesBoolean<T>>;

export const registerToMatchBoolean = () => {
  const matcher: Matcher = (actual, _, returnType, { not }) => {
    if (returnType.isLiteral() && returnType.getText() === 'true') return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold('true, false or boolean');
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  };
  registerMatcher(toMatchBoolean, matcher);

  // Plan to remove this in next major version
  registerMatcher('toBeBoolean', matcher);
};
