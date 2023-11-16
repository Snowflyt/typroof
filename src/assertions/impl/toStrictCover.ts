import chalk from 'chalk';

import { registerMatcher } from '../matcher';

import type { Not, StrictCovers } from '../../utils/type-tools';

export const toStrictCover = 'toStrictCover';

export type ToStrictCover<T> = <U>(t?: U extends T ? U : never) => StrictCovers<T, U>;
export type NotToStrictCover<T> = <U>(t?: U) => Not<StrictCovers<T, U>>;

export const registerToStrictCover = () =>
  registerMatcher(toStrictCover, (actual, [expected], returnType, { not }) => {
    if (returnType.isLiteral() && returnType.getText() === 'true') return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold(expected!.getText());
    const actualType = chalk.bold(actual.type.getText());

    throw (
      `Expect ${actualText} (${actualType}) ${not ? 'not ' : ''}to strict cover ${expectedType}, ` +
      `but ${not ? 'it does' : 'it does not'}.`
    );
  });
