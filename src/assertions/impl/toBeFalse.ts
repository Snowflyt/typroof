import chalk from 'chalk';

import { registerMatcher } from '../matcher';

import type { IsFalse, Not } from '../../utils/type-tools';

export const toBeFalse = 'toBeFalse';

export type ToBeFalse<T> = () => IsFalse<T>;
export type NotToBeFalse<T> = () => Not<IsFalse<T>>;

export const registerToBeFalse = () =>
  registerMatcher(toBeFalse, (actual, _, returnType, { not }) => {
    if (returnType.isLiteral() && returnType.getText() === 'true') return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold('false');
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
