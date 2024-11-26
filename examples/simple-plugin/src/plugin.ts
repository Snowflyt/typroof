import chalk from 'chalk';

import type { Plugin } from 'typroof';

export const foo = (): Plugin => ({
  // `name` is required, and recommended to be named as `typroof-plugin-*`
  name: 'typroof-plugin-example',
  analyzers: {
    // Just like what you have seen in `registerAnalyzer`
    beFoo: (actual, _expected, { not }) => {
      const actualText = chalk.bold(actual.text);
      const expectedType = chalk.bold('"foo"');
      const actualType = chalk.bold(actual.type.getText());

      throw (
        `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, ` +
        `but got ${actualType}.`
      );
    },
  },
});
