import type { Plugin } from 'typroof';

const bold = (text: string) => `\x1b[1m${text}\x1b[22m`;

export const foo = (): Plugin => ({
  // `name` is required, and recommended to be named as `typroof-plugin-*`
  name: 'typroof-plugin-example',
  analyzers: {
    // Just like what you have seen in `registerAnalyzer`
    beFoo: (actual, _expected, { not, typeChecker }) => {
      const actualText = bold(actual.text);
      const expectedType = bold('"foo"');
      const actualType = bold(typeChecker.typeToString(actual.type));

      throw (
        `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, ` +
        `but got ${actualType}.`
      );
    },
  },
});
