import chalk from 'chalk';

import { registerMatcher } from '../matcher';

import type { Extends, Not } from '../../utils/type-tools';

export const toExtend = 'toExtend';

export type ToExtend<T> = <U>(t?: U) => Extends<T, U>;
export type NotToExtend<T> = <U>(t?: U) => Not<Extends<T, U>>;

export const registerToExtend = () =>
  registerMatcher(toExtend, (actual, [expected], returnType, { not }) => {
    if (returnType.isLiteral() && returnType.getText() === 'true') return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold(expected!.getText());
    const actualType = chalk.bold(actual.type.getText());

    throw (
      `Expect ${actualText} (${actualType}) ${not ? 'not ' : ''}to extend ${expectedType}, ` +
      `but ${not ? 'it does' : 'it does not'}.`
    );
  });
