import chalk from 'chalk';

import { registerMatcher } from '../matcher';

import type { IsBoolean, Not } from '../../utils/type-tools';

export const toBeBoolean = 'toBeBoolean';

export type ToBeBoolean<T> = () => IsBoolean<T>;
export type NotToBeBoolean<T> = () => Not<IsBoolean<T>>;

export const registerToBeBoolean = () =>
  registerMatcher(toBeBoolean, (actual, _, returnType, { not }) => {
    if (returnType.isLiteral() && returnType.getText() === 'true') return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold('true, false or boolean');
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
