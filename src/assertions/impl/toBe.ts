import chalk from 'chalk';

import { registerMatcher } from '../matcher';

import type { Equals, Not } from '../../utils/type-tools';

export const toBe = 'toBe';

export type ToBe<T> = <U>(t?: U extends T ? U : never) => Equals<T, U>;
export type NotToBe<T> = <U>(t?: U) => Not<Equals<T, U>>;

export const registerToBe = () =>
  registerMatcher(toBe, (actual, [expected], returnType, { not }) => {
    if (returnType.isLiteral() && returnType.getText() === 'true') return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold(expected!.getText());
    const actualType = chalk.bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
