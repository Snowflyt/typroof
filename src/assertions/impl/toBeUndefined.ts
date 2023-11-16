import chalk from 'chalk';

import { registerMatcher } from '../matcher';

import type { IsUndefined, Not } from '../../utils/type-tools';

export const toBeUndefined = 'toBeUndefined';

export type ToBeUndefined<T> = () => IsUndefined<T>;
export type NotToBeUndefined<T> = () => Not<IsUndefined<T>>;

export const registerToBeUndefined = () =>
  registerMatcher(toBeUndefined, (actual, _, returnType, { not }) => {
    if (returnType.isLiteral() && returnType.getText() === 'true') return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold('undefined');
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
