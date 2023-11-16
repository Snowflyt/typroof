import chalk from 'chalk';

import { registerMatcher } from '../matcher';

import type { Not, StrictExtends } from '../../utils/type-tools';

export const toStrictExtend = 'toStrictExtend';

export type ToStrictExtend<T> = <U>(t?: U) => StrictExtends<T, U>;
export type NotToStrictExtend<T> = <U>(t?: U) => Not<StrictExtends<T, U>>;

export const registerToStrictExtend = () =>
  registerMatcher(toStrictExtend, (actual, [expected], returnType, { not }) => {
    if (returnType.isLiteral() && returnType.getText() === 'true') return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold(expected!.getText());
    const actualType = chalk.bold(actual.type.getText());

    throw (
      `Expect ${actualText} (${actualType}) ${not ? 'not ' : ''}to ` +
      `strict extend ${expectedType}, ` +
      `but ${not ? 'it does' : 'it does not'}.`
    );
  });
