import chalk from 'chalk';

import { registerMatcher } from '../matcher';

import type { IsNull, Not } from '../../utils/type-tools';

export const toBeNull = 'toBeNull';

export type ToBeNull<T> = () => IsNull<T>;
export type NotToBeNull<T> = () => Not<IsNull<T>>;

export const registerToBeNull = () =>
  registerMatcher(toBeNull, (actual, _, returnType, { not }) => {
    if (returnType.isLiteral() && returnType.getText() === 'true') return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold('null');
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
