import chalk from 'chalk';

import { registerMatcher } from '../matcher';

import type { IsTrue, Not } from '../../utils/type-tools';

export const toBeTrue = 'toBeTrue';

export type ToBeTrue<T> = () => IsTrue<T>;
export type NotToBeTrue<T> = () => Not<IsTrue<T>>;

export const registerToBeTrue = () =>
  registerMatcher(toBeTrue, (actual, _, returnType, { not }) => {
    if (returnType.isLiteral() && returnType.getText() === 'true') return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold('true');
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
