import chalk from 'chalk';

import { registerMatcher } from '../matcher';

import type { IsNullish, Not } from '../../utils/type-tools';

export const toBeNullish = 'toBeNullish';

export type ToBeNullish<T> = () => IsNullish<T>;
export type NotToBeNullish<T> = () => Not<IsNullish<T>>;

export const registerToBeNullish = () =>
  registerMatcher(toBeNullish, (actual, _, returnType, { not }) => {
    if (returnType.isLiteral() && returnType.getText() === 'true') return;

    const actualText = chalk.bold(actual.text);
    const expectedType =
      chalk.bold('null') + ', ' + chalk.bold('undefined') + ' or ' + chalk.bold('null | undefined');
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
