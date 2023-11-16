import chalk from 'chalk';

import { registerMatcher } from '../matcher';

import type { IsAny, Not } from '../../utils/type-tools';

export const toBeAny = 'toBeAny';

export type ToBeAny<T> = () => IsAny<T>;
export type NotToBeAny<T> = () => Not<IsAny<T>>;

export const registerToBeAny = () =>
  registerMatcher(toBeAny, (actual, _, returnType, { not }) => {
    if (returnType.isLiteral() && returnType.getText() === 'true') return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold('any');
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
