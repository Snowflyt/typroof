import { bold } from '../../utils/colors';
import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a type to be `true`, `false`, or `boolean`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(matchBoolean); // fail
 * expect<'foo'>().not.to(matchBoolean); // pass
 * expect<true>().to(matchBoolean); // pass
 * expect<false>().to(matchBoolean); // pass
 * expect<boolean>().to(matchBoolean); // pass
 * ```
 *
 * @since 0.1.2
 */
export const matchBoolean = match<'matchBoolean'>();

export const registerToMatchBoolean = () => {
  registerAnalyzer('matchBoolean', (actual, _expected, { not }) => {
    const actualText = bold(actual.text);
    const expectedType = bold('true, false or boolean');
    const actualType = bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
};
