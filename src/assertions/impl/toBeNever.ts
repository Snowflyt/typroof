import chalk from 'chalk';

import { registerMatcher } from '../matcher';

import type { IsNever, Not } from '../../utils/type-tools';

export const toBeNever = 'toBeNever';

export type ToBeNever<T> = () => IsNever<T>;
export type NotToBeNever<T> = () => Not<IsNever<T>>;

export const registerToBeNever = () =>
  registerMatcher(toBeNever, (actual, _, returnType, { not }) => {
    if (returnType.isLiteral() && returnType.getText() === 'true') return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold('never');
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
