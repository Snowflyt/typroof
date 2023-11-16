import chalk from 'chalk';

import { registerMatcher } from '../matcher';

import type { Covers, Not } from '../../utils/type-tools';

export const toCover = 'toCover';

export type ToCover<T> = <U>(t?: U extends T ? U : never) => Covers<T, U>;
export type NotToCover<T> = <U>(t?: U) => Not<Covers<T, U>>;

export const registerToCover = () =>
  registerMatcher(toCover, (actual, [expected], returnType, { not }) => {
    if (returnType.isLiteral() && returnType.getText() === 'true') return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold(expected!.getText());
    const actualType = chalk.bold(actual.type.getText());

    throw (
      `Expect ${actualText} (${actualType}) ${not ? 'not ' : ''}to cover ${expectedType}, ` +
      `but ${not ? 'it does' : 'it does not'}.`
    );
  });
